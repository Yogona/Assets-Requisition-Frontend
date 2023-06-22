<script>

export default {
    props: ['user'],
    data() {
        return {
            isLoading: false,

            description: null,
            unit: null,
            quantity: null,

            payload: {
                department: null,
                store: null,
                items: [],
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
            this.payload.items = [];
            this.payload.department = null;
            this.payload.store = null;
        },
        async createIssueNote() {
            if (this.payload.items.length == 0) {
                this.notification.title = "No items";
                this.notification.message = "Please attach items";
                this.notification.modal.show();
            } else if (this.$refs.createIssueNoteForm.checkValidity()) {
                this.isLoading = true;

                const data = {
                    "items": this.payload.items,
                    // "department": this.payload.department,
                    "store": this.payload.store,
                };

                await this.axios.post(this.api + "/issue-notes", data).then((res) => {
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
            await this.axios.get(this.api + "/departs/list").then((res) => {
                if (res.status == 200) {
                    this.collections.departments = res.data.data;
                }
            });
        },
        async getAssets() {
            await this.axios.get(this.api + "/assets/department/"+this.payload.department).then((res) => {
                if (res.status == 200) {
                    this.collections.assets = res.data.data;
                    console.log(this.collections.assets);
                }
            });
        },
        addItemToIssueNote() {
            let itemDetails = {
                "description": this.description,
                "unit": this.unit,
                "quantity": this.quantity
            };

            this.payload.items.push(itemDetails);

            this.description = null;
            this.quantity = null;
            this.unit = null;
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
                <form @submit.prevent="onSubmit">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="asset" class="form-label">Asset</label>
                            <select required placeholder="Select" v-model="payload.assets" class="form-control" id="deparment">
                                <option disabled>Select asset</option>
                                <option v-for="asset in collections.assets" :value="asset.id">{{ asset.name }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="quantity" class="form-label">Quantity</label>
                            <input type="number" v-model="quantity" class="form-control" id="quantity"
                                aria-describedby="quantity" autocomplete="true" min="1" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" @click="addItemToIssueNote" class="btn btn-secondary">
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
                        <label for="department" class="form-label">From Department</label>
                        <select required placeholder="Select" @change="getAssets" v-model="payload.department" class="form-control" id="deparment">
                            <option disabled>Select department</option>
                            <option v-for="depart in collections.departments" :value="depart.id">{{ depart.name }}</option>
                        </select>

                    </div>

                    <div class="col">
                        <span class="row">To Department</span>
                        <span class="row">{{ user.department.name }}</span>
                    </div>
                </div>
                <div class="row mb-3">
                    <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addTransferAssets">
                        Add Items
                    </button>
                    <div v-if="payload.items.length == 0" class="row mb-2">
                        <em>No items attached</em>
                    </div>
                    <div v-else class="row mb-2">
                        <span @click="detachInstrument(attachedInstrument.instrument_id)" title="Click to remove" v-for="item in payload.items" class="mb-2 mx-2 px-auto col-md-2 tile-accordion badge bg-primary">
                            {{ item.description }} {{ item.quantity }} {{ item.unit }}
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
                <button type="submit" @click="createIssueNote()" class="btn btn-success">
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