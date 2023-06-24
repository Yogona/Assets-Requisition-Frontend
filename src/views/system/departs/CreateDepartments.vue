<script>

export default {
    data() {
        return {
            isLoading: false,

            name: null,
            abbreviation: null,
            description: null,
            departmentNumber: null,
            buildingNumber: null,

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
            this.name               = null;
            this.abbreviation       = null;
            this.description        = null;
            this.departmentNumber   = null;
            this.buildingNumber     = null;
        },
        async createDepartment() {
            if (this.$refs.createDepartmentsForm.checkValidity()) {
                this.isLoading = true;

                const data = {
                    "name": this.name,
                    "abbreviation": this.abbreviation,
                    "description": this.description,
                    "departmentNumber": this.departmentNumber,
                    "buildingNumber": this.buildingNumber
                };

                await this.axios.post(this.api + "/departs/create", data).then((res) => {
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
    },
    mounted() {
        this.notification.modal = this.Modal.getOrCreateInstance(
            document.getElementById("departmentCreationNotification"), { backdrop: "static", keyboard: false }
        );
    }
}
</script>

<template>
    <div class="modal fade" id="departmentCreationNotification" tabindex="-1" aria-labelledby="createDepartmentLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content container-bg">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{ notification.title }}</h1>
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
        <form ref="createDepartmentsForm" @submit.prevent="onSubmit">
            <div class="card-header">
                <h3 class="text-center card-title" id="createDepartmentLabel">CREATE DEPARTMENTS</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" v-model="name" class="form-control" id="name"
                        aria-describedby="name" autocomplete="true" required />
                </div>
                <div class="mb-3">
                    <label for="abbreviation" class="form-label">Abbreviation</label>
                    <input type="text" v-model="abbreviation" class="form-control" id="abbreviation"
                        aria-describedby="abbreviation" autocomplete="true" required />
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea v-model="description" class="form-control" id="description" autocomplete="true">
                    </textarea>
                </div>
                <div class="mb-3">
                    <label for="department-number" class="form-label">Department Number</label>
                    <input type="text" v-model="departmentNumber" class="form-control" id="department-number"
                        aria-describedby="department-number" autocomplete="true" required />
                </div>
                <div class="mb-3">
                    <label for="building-number" class="form-label">Building Number</label>
                    <input type="text" v-model="buildingNumber" class="form-control" id="building-number"
                        aria-describedby="building-number" autocomplete="true" required />
                </div>
            </div>
            <div class="card-footer row">
                <button type="submit" @click="createDepartment()" class="btn btn-success">
                    <span :hidden="isLoading">Add department</span>
                    <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>
        </form>

    </div>
</template>

<style></style>