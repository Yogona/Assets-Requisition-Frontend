<script>

export default {
    props: ['user'],
    data() {
        return {
            isLoading: false,
            isGettingDepartments: false,

            asset: null,
            quantity: null,

            payload: {
                fromDepartment: null,
                toDepartment: null,
                store: null,
                assets: [],
            },

            collections: {
                departments: null,
                assets: null,
            },

            //Notification modal
            notification: {
                modal: null,
                title: null,
                message: null,
            }


        };
    },
    methods: {
        clearFields() {
            this.payload.assets = [];
            this.payload.fromDepartment = null;
            this.payload.toDepartment = null;
        },
        async requestAssetTransfer() {
            if (this.payload.assets.length == 0) {
                this.notification.title = "No assets mentioned";
                this.notification.message = "Please attach assets for transfer.";
                this.notification.modal.show();
            } else if (this.$refs.createIssueNoteForm.checkValidity()) {
                this.isLoading = true;

                await this.axios.post(this.api + "/assets/transfers/request", this.payload).then((res) => {
                    const resData = res.data;
                    this.notification.title = "Succeeded";
                    this.notification.message = resData.message;

                    //Clears create user form fields
                    this.clearFields();
                }).catch((err) => {
                    const res = err.response;
                    const resData = res.data;

                    if (res.status == 422) {
                        this.notification.title = resData.message;
                        this.notification.message = resData.data;
                    } else {
                        this.notification.title = "Failed";
                        this.notification.message = resData.message;
                    }
                }).finally(() => {
                    this.isLoading = false;
                    this.notification.modal.show();
                });

            }
        },
        async getDepartments() {
            this.isGettingDepartments = true;

            await this.axios.get(this.api + "/departs/list").then((res) => {
                if (res.status == 200) {
                    this.collections.departments = res.data.data;
                }
            }).finally(() => {
                this.isGettingDepartments = false;
            });
        },
        async getAssets() {
            await this.axios.get(this.api + "/assets/department/"+this.payload.fromDepartment).then((res) => {
                if (res.status == 200) {
                    this.collections.assets = res.data.data;
                }
            }).catch((err) => {
                const res = err.response;
                const resData = res.data;

                this.collections.assets = resData.data;
            });
        },
        attachAsset() {
            if(this.$refs.attachAssetForm.checkValidity()) {
                let itemDetails = {
                    "asset": this.asset,
                    "quantity": this.quantity
                };
    
                this.payload.assets.push(itemDetails);
console.log(this.payload)
                this.asset = null;
                this.quantity = null;            
            }
        }
    },
    mounted() {
        this.notification.modal = this.Modal.getOrCreateInstance(
            document.getElementById("issueNoteNotification"), { backdrop: "static", keyboard: false }
        );
        this.getDepartments();
        // this.getStores();
    }
}
</script>

<template>
    <div class="modal fade" id="issueNoteNotification" tabindex="-1" aria-labelledby="createIssueNoteLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content container-bg">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="createIssueNoteLabel">{{ notification.title }}</h1>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        {{ notification.message }}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" :class="{ disabled: isLoading }" class="btn btn-secondary"
                        data-bs-dismiss="modal">Ok</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="addTransferAssets" tabindex="-1" aria-labelledby="addIssueNoteItemsLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content container-bg">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addIssueNoteItemsLabel">Add items to Transfer</h1>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form ref="attachAssetForm" @submit.prevent="onSubmit">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="asset" class="form-label">Asset</label>
                            <select required placeholder="Select" v-model="asset" class="form-control" id="deparment">
                                <option disabled>Select asset</option>
                                <option v-for="asset in collections.assets" :value="asset">{{ asset.instrument.description }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="quantity" class="form-label">Quantity</label>
                            <input type="number" v-model="quantity" class="form-control" id="quantity"
                                aria-describedby="quantity" autocomplete="true" min="1" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button data-bs-dismiss="modal" data-bs-target="#addTransferAssets" type="submit" @click="attachAsset" class="btn btn-secondary">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="card p-5 m-5">
        <form ref="createIssueNoteForm" @submit.prevent="onSubmit">
            <div class="card-header">
                <h3 class="text-center card-title" id="createIssueNoteLabel">ASSETS TRANSFER FORM</h3>
            </div>
            <div class="card-body">
                <div class="mb-3 row">
                    <div class="col">
                        <label for="from-department" class="form-label">From Department</label>
                        <select v-if="!isGettingDepartments" required placeholder="Select" @change="getAssets" v-model="payload.fromDepartment" class="form-control" id="from-deparment">
                            <option disabled>Select department</option>
                            <option v-for="depart in collections.departments" :value="depart.id">{{ depart.name }}</option>
                        </select>
                        <span v-else>
                            Fetching departments
                        </span>
                    </div>

                    <div class="col">
                        <label for="to-department" class="form-label">To Department</label>
                        <select v-if="!isGettingDepartments" required placeholder="Select" v-model="payload.toDepartment" class="form-control" id="to-deparment">
                            <option disabled>Select department</option>
                            <option v-for="depart in collections.departments" :value="depart.id">{{ depart.name }}</option>
                        </select>
                        <span v-else>
                            Fetching departments
                        </span>
                    </div>
                </div>
                <div v-if="collections.assets != null" class="row mb-3">
                    <button class="btn btn-secondary mb-1" data-bs-toggle="modal" data-bs-target="#addTransferAssets">
                        Add Items
                    </button>
                    <div v-if="payload.assets.length == 0" class="row mb-2">
                        <em>No items attached</em>
                    </div>
                    <div v-else class="row mb-2">
                        <span @click="detachInstrument(attachedInstrument.instrument_id)" title="Click to remove" v-for="payloadAsset in payload.assets" class="mb-2 mx-2 px-auto col-md-2 tile-accordion badge bg-primary">
                            {{ payloadAsset.quantity }} 
                            {{ payloadAsset.asset.instrument.description }}
                            {{ payloadAsset.asset.instrument.unit }}
                        </span>
                    </div>
                </div>
                <!-- <div class="mb-3">
                    <label for="store" class="form-label">Store</label>
                    <select required placeholder="Select" v-model="payload.store" class="form-control" id="store">
                        <option disabled>Select store</option>
                        <option v-for="store in collections.stores" :value="store.id">{{ store.name }}</option>
                    </select>
                </div> -->
            </div>
            <div class="card-footer row">
                <button type="submit" @click="requestAssetTransfer()" class="btn btn-success">
                    <span :hidden="isLoading">Submit </span>
                    <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>
        </form>

    </div>
</template>

<style></style>