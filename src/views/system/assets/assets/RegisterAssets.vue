<script>

export default {
    props: ['user'],
    data() {
        return {
            isLoading: false,

            payload: {
                description: null,
                unit: null,
                quantity: null,
                department: null,
                // store: null,
            },

            collections: {
                departments: null,
                stores: null,
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
            this.payload = {
                description: null,
                unit: null,
                quantity: null,
                department: null,
            };
        },
        async registerAsset() {
            if (this.$refs.registerAssetForm.checkValidity()) {
                this.isLoading = true;

                const data = {
                    "description":  this.payload.description,
                    "unit":         this.payload.unit,
                    "quantity":     this.payload.quantity,
                    "department":   this.payload.department
                };

                await this.axios.post(this.api + "/assets/register", data).then((res) => {
                    const resData = res.data;
                    this.notification.title = "Succeeded";
                    this.notification.message = resData.message;

                    //Clears create user form fields
                    this.clearFields();
                }).catch((err) => {
                    const res = err.response;
                    const resData = res.data;

                    if (res.status == 422) {
                        this.notification.title     = resData.message;
                        this.notification.message   = resData.data;
                    } else {
                        this.notification.title     = "Failed";
                        this.notification.message   = resData.message;
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
        async getStores() {
            await this.axios.get(this.api + "/stores").then((res) => {
                if (res.status == 200) {
                    this.collections.stores = res.data.data;
                }
            });
        },
    },
    mounted() {
        this.notification.modal = this.Modal.getOrCreateInstance(
            document.getElementById("issueNoteNotification"), { backdrop: "static", keyboard: false }
        );
        this.getDepartments();
        this.getStores();
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

    <div class="card p-5 m-5">
        <form ref="registerAssetForm" @submit.prevent="onSubmit">
            <div class="card-header">
                <h3 class="text-center card-title" id="createIssueNoteLabel">REGISTER ASSET</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <input type="text" v-model="payload.description" class="form-control" id="description" aria-describedby="description"
                        autocomplete="true" required />
                </div>
                <div class="mb-3">
                    <label for="unit" class="form-label">Unit</label>
                    <input type="text" v-model="payload.unit" class="form-control" id="unit" aria-describedby="unit"
                        autocomplete="true" required />
                </div>
                
                <!-- <div class="mb-3">
                    <label for="store" class="form-label">Store</label>
                    <select required placeholder="Select" v-model="payload.store" class="form-control" id="store">
                        <option disabled>Select store</option>
                        <option v-for="store in collections.stores" :value="store.id">{{ store.name }}</option>
                    </select>
                </div> -->

                <div class="mb-3">
                    <label for="quantity" class="form-label">Quantity</label>
                    <input type="number" v-model="payload.quantity" class="form-control" id="quantity" aria-describedby="quantity"
                        autocomplete="true" min="1" required />
                </div>
                <div class="mb-3">
                    <label for="department" class="form-label">Department</label>
                    <select required placeholder="Select" v-model="payload.department" class="form-control" id="deparment">
                        <option disabled>Select department</option>
                        <option v-for="depart in collections.departments" :value="depart.id">{{ depart.name }}</option>
                    </select>
                </div>
            </div>
            <div class="card-footer row">
                <button type="submit" @click="registerAsset()" class="btn btn-success">
                    <span :hidden="isLoading">Register </span>
                    <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>
        </form>

    </div>
</template>

<style></style>