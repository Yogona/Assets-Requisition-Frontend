<script>
import { BIconBoxArrowDownRight, BIconBoxArrowInRight } from 'bootstrap-icons-vue';
export default {
    props: ['user'],
    emits: ['locationChange', 'toggleAuth'],
    components: {
        BIconBoxArrowDownRight,
        BIconBoxArrowInRight
    },
    data() {
        return {
            firstName: null,
            lastName: null,
            username: null,
            gender: null,
            email: null,
            phone: null,
            selectedDepartment: null,
            password: null,
            confirmPass: null,
            error: null,

            collections: {
                roles: null,
                departments: null,
            },
            isLoading: false,
        }
    },
    methods: {
        validate() {
            if (this.username != null && this.password != null) {
                return true;
            }

            return false;
        },
        async login() {
            if (this.validate()) {
                this.isLoading = true;
                this.error = null;

                await this.axios.get(this.origin + "/sanctum/csrf-cookie").then((res) => {
                    this.status = res.status;
                }).catch((err) => {

                });

                if (this.status == 204) {
                    await this.axios.post(this.api + "/login", {
                        "username": this.username,
                        "password": this.password
                    }).then((res) => {
                        if (res.status == 202) {
                            this.$emit("locationChange", '/home');
                        }

                    }).catch((err) => {
                        // const resData;
                        this.res = err.response.data;
                        this.error = this.res.message;
                    }).finally(() => {
                        this.password = null;
                    });

                }

                this.isLoading = false;
            }
        },
        async register() {
            this.isLoading = true;
            this.error = null;

            await this.axios.post(this.api + "/register", {
                "first_name": this.firstName,
                "last_name": this.lastName,
                "username": this.username,
                "gender": this.gender,
                "email": this.email,
                "phone": this.phone,
                "department": this.selectedDepartment,
                "password": this.password,
                "confirm_pass": this.confirmPass,
            }).then((res) => {
                if (res.status == 201) {
                    this.$emit("toggleAuth");
                    alert(res.data.message);
                }

            }).catch((err) => {console.log(err)
                // const resData;
                const res = err.response;
                const resData = res.data;
                this.error = resData.message;

                if (res.status == 422) {
                    this.error = resData.data;
                }
            }).finally(() => {
                this.isLoading = false;
            });

            this.isLoading = false;
            // if (this.validate()) {
            // }
        },
        async getDepartments() {
            await this.axios.get(this.api + "/departs/list").then((res) => {
                if (res.status == 200) {
                    this.collections.departments = res.data.data;
                }
            });
        },
        toggleLogin() {
            this.$emit('toggleAuth');
        }
    },
    mounted() {
        this.getDepartments();
    },

}
</script>

<template>
    <div id="registration-pane" class="container-bg white-text">
        <form ref="createUsersForm" @submit.prevent="onSubmit">
            <div class="card-header">
                <h3 class="text-center card-title" id="createUserLabel">STAFF REGISTRATION</h3>
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
                    <label for="department" class="form-label">Department</label>
                    <select  placeholder="Select" v-model="selectedDepartment" class="form-control" id="deparment">
                        <option disabled selected value="null">Select department</option>
                        <option v-for="depart in collections.departments" :value="depart.id">{{ depart.name }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" v-model="password" class="form-control" id="password" autocomplete="true" required/>
                </div>
                <div class="mb-3">
                    <label for="confirmPass" class="form-label">Confirm Password</label>
                    <input type="password" v-model="confirmPass" class="form-control" id="confirmPass" autocomplete="true" required/>
                </div>
                <span class="error">{{ passError }}</span>
            </div>
            <div class="card-footer row">
                <button type="submit" @click="register()" class="btn btn-success">
                    <span :hidden="isLoading">Register</span>
                    <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>
            <div v-if="error" class="text-center mb-2">
              <span  class="error text-center">* {{ error }}</span>
            </div>
            <a @click="toggleLogin()">Login</a>
        </form>
    </div>
</template>

<style>
@media(min-width:720px) {
    #registration-pane {
        width: 40rem;
        padding: 50px 50px 50px 50px;
        position: relative;
        left: 20rem;
        top: 5rem;
    }

    /* body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 10fr 1fr;
    padding: 0 2rem;
  } */
}
</style>
