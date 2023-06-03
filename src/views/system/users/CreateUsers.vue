<script>

export default {
    data() {
        return {
            isLoading: false,

            firstName: null,
            lastName: null,
            username: null,
            gender: null,
            email: null,
            phone: null,
            selectedRole: null,
            selectedDepartment: null,

            collections: {
                roles: null,
                departments: null,
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
        async getRoles() {
            await this.axios.get(this.api + "/roles").then((res) => {
                if (res.status == 200) {
                    this.collections.roles = res.data.data;
                }
            });
        },
        async getDepartments() {
            await this.axios.get(this.api + "/departs/list").then((res) => {
                if (res.status == 200) {
                    this.collections.departments = res.data.data;
                }
            });
        },
        clearFields() {
            this.firstName = null;
            this.lastName = null;
            this.username = null;
            this.gender = null;
            this.email = null;
            this.phone = null;
            this.selectedRole = null;
            this.selectedDepartment = null;
        },
        async createUser() {
            if (this.$refs.createUsersForm.checkValidity()) {
                //We clear these fields because it avoids interlace of requests feedbacks

                // if (this.password != this.confirmPass) {
                //     this.passError = "**Passwords do not match.*";
                // } else if (this.$refs.form.checkValidity()) {
                // }
                this.isLoading = true;

                const data = {
                    "first_name": this.firstName,
                    "last_name": this.lastName,
                    "username": this.username,
                    "gender": this.gender,
                    "email": this.email,
                    "phone": this.phone,
                    "role": this.selectedRole,
                    "department": this.selectedDepartment
                };

                await this.axios.post(this.api + "/users/create", data).then((res) => {
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
    },
    mounted() {
        this.getRoles();    
        this.getDepartments();
        this.notification.modal = this.Modal.getOrCreateInstance(
            document.getElementById("userCreationNotification"), { backdrop: "static", keyboard: false }
        );
    }
}
</script>

<template>
    <div class="modal fade" id="userCreationNotification" tabindex="-1" aria-labelledby="deleteDepartmentLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content container-bg">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{notification.title}}</h1>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        {{notification.message}}
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
        <form ref="createUsersForm" @submit.prevent="onSubmit">
            <div class="card-header">
                <h3 class="text-center card-title" id="createUserLabel">CREATE USERS</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="first-name" class="form-label">First Name</label>
                    <input type="text" v-model="firstName" class="form-control" id="first-name" aria-describedby="first-name" autocomplete="true" required/>
                </div>
                <div class="mb-3">
                    <label for="last-name" class="form-label">Last Name</label>
                    <input type="text" v-model="lastName" class="form-control" id="last-name" autocomplete="true" required/>
                </div>
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" v-model="username" class="form-control" id="username" autocomplete="true" required/>
                </div>
                <div class="mb-3">
                    <label for="gender" class="form-label">Gender</label>
                    <select placeholder="Select" v-model="gender" class="form-control" id="gender">
                        <option disabled selected>Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" v-model="email" class="form-control" id="email" autocomplete="true" required/>
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="tel" v-model="phone" class="form-control" id="phone" autocomplete="true" required/>
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Role</label>
                    <select placeholder="Select" v-model="selectedRole" class="form-control" id="role">
                        <option disabled selected value="null">Select role</option>
                        <option v-for="role in collections.roles" :value="role.id">{{ role.name }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="department" class="form-label">Department</label>
                    <select  placeholder="Select" v-model="selectedDepartment" class="form-control" id="deparment">
                        <option disabled selected value="null">Select department</option>
                        <option v-for="depart in collections.departments" :value="depart.id">{{ depart.name }}</option>
                    </select>
                </div>
                <!-- <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control" id="password" autocomplete="true" required/>
            </div>
            <div class="mb-3">
                <label for="confirmPass" class="form-label">Confirm Password</label>
                <input type="password" v-model="confirmPass" class="form-control" id="confirmPass" autocomplete="true" required/>
            </div>
            <span class="error">{{ passError }}</span> -->
            </div>
            <div class="card-footer row">
                <button type="submit" @click="createUser()" class="btn btn-success">
                    <span :hidden="isLoading">Add user</span>
                    <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>
        </form>

    </div>
</template>

<style></style>