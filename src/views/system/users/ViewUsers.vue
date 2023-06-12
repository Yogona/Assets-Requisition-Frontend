<script>
import Progress from '../../../components/Progress.vue';
import { BIconTrash, BIconPenFill } from 'bootstrap-icons-vue';

export default {
    components: {
        BIconTrash, BIconPenFill, Progress
    },
    data() {
        return {
            isLoading: false,
            searchQuery: null,

            collections: {
                roles: null,
                users: null,
                departments: null,
            },
            message: "Needs to get users.",
            pagination: {
                records: 10,
                currentPage: 1,
            },

            id: null,
            firstName:null,
            lastName: null,
            gender: null,
            selectedRole: "all",
            selectedDepartment: null,

            notification: {
                title: null,
                message: null,
            },

            toast: null,
            deleteModal: null,
        };
    },
    methods: {
        fetchResponseData(res) {
            //First data is axios data, second one is for response sent by backend
            const resData = res.data;
            this.message = resData.message;
            const pageData = resData.data;
            //And this third data is from pagination
            this.collections.users = pageData.data;

            //Pagination details
            this.pagination = {
                records: this.pagination.records,
                links: pageData.links,
                from: pageData.from,
                to: pageData.to,
                total: pageData.total,
                currentPage: pageData.current_page,
                firstPageUrl: pageData.first_page_url,
                lastPageurl: pageData.last_page_url,
                prevPageUrl: pageData.prev_page_url,
                lastPage: pageData.last_page,
            };

            //Removes laravel useless prev and next labels
            let tempLinks = [];
            var index = 0;
            const links = this.pagination.links;
            links.forEach((val) => {
                //Only stores links excluding first and last to avoid laravel useless links
                if (!(index == 0 || index == (links.length - 1))) {
                    tempLinks.push(val);
                }
                ++index;
            });
            this.pagination.links = tempLinks;
        },
        async getRoles() {
            await this.axios.get(this.api + "/roles").then((res) => {
                if (res.status == 200) {
                    this.collections.roles = res.data.data;
                }
            });
        },
        async getUsers() {
            this.isLoading = true;

            let url = this.api;
            url += "/users/role/" + this.selectedRole;
            url += "/records/" + this.pagination.records;
            url += "?page=" + this.pagination.currentPage;

            await this.axios.get(url).then((res) => {
                if (res.status == 200) {
                    this.fetchResponseData(res);
                }
            }).finally(() => {
                this.isLoading = false;
            });
        },
        async getDepartments() {
            await this.axios.get(this.api + "/departs").then((res) => {
                if (res.status == 200) {
                    this.collections.departments = res.data.data;
                }
            });
        },

        preFillUpdatingFields(user) {
            this.id = user.id;
            this.firstName = user.first_name;
            this.lastName = user.last_name;
            this.gender = user.gender;
            this.selectedRole = user.role.id;
            const depart = user.department.id;

            this.selectedDepartment = (depart == null) ? null : depart.id;

            // this.username = user.username;
            // this.email = user.email;
            // this.phone = user.phone;
        },
        clearFields() {
            this.firstName = null;
            this.lastName = null;
            this.username = null;
            this.gender = null;
            this.email = null;
            this.phone = null;
            this.selectedRole = "all";
            this.selectedDepartment = null;
        },
        async updateProfile() {
            if (this.$refs.updateProfileForm.checkValidity()) {
                this.isLoading = true;

                const data = {
                    "first_name": this.firstName,
                    "last_name": this.lastName,
                    "gender": this.gender,
                    "role": this.selectedRole,
                    "department": this.selectedDepartment
                };

                await this.axios.patch(this.api + "/users/update/" + this.id, data).then((res) => {
                    const resData = res.data;
                    this.notification.title = "Succeeded!";
                    this.notification.message = resData.message;

                    this.clearFields();

                    this.getUsers();
                }).catch((err) => {
                    const res = err.response;
                    const resData = res.data;

                    if (res.status == 422) {
                        this.notification.title = resData.message;
                        this.notification.message = resData.data;
                    } else {
                        this.notification.title = "Failed!";
                        this.notification.message = resData.message;
                    }
                }).finally(() => {
                    this.isLoading = false;
                    this.toast.show();
                });

            }
        },

        showDeleteModalConfirmation(user) {
            this.id = user.id;
            this.deleteModal = this.Modal.getOrCreateInstance(
                document.getElementById("delete-user-modal"), { backdrop: "static", keyboard: false }
            );
            this.deleteModal.show();
        },
        async deleteUser() {
            this.isLoading = true;

            this.axios.delete(this.api + "/users/delete/" + this.id).then((res) => {
                const resData = res.data;
                this.notification.title = "Succeeded!";
                this.notification.message = resData.message;
                this.getUsers();
            }).catch((err) => {
                console.log(err);
                const res = err.response;
                const resData = res.data;

                this.notification.title = "Failed!";
                this.notification.message = resData.message;
            }).finally(() => {
                this.isLoading = false;
                this.toast.show();
                this.deleteModal.hide();
            });
        }
    },
    mounted() {
        this.getRoles();
        this.getUsers();
        this.getDepartments();
        this.toast = this.Toast.getOrCreateInstance(this.$refs.feedbackToast);
    }
}
</script>

<template>
    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div ref="feedbackToast" id="feedbackToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <!-- <img src="..." class="rounded me-2" alt="..."> -->
                <strong class="me-auto">{{ notification.title }}</strong>
                <!-- <small>11 mins ago</small> -->
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                {{ notification.message }}
            </div>
        </div>
    </div>

    <!-- Update Profile Modal -->
    <div class="modal" id="update-profile-modal" tabindex="-1"
        aria-labelledby="updateProfileLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content container-bg">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="updateProfileLabel">Update a user profile</h1>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form ref="updateProfileForm" @submit.prevent="onSubmit">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="first-name" class="form-label">First Name</label>
                            <input type="text" v-model="firstName" class="form-control" id="first-name" aria-describedby="first-name" autocomplete="true" required/>
                        </div>
                        <div class="mb-3">
                            <label for="last-name" class="form-label">Last Name</label>
                            <input type="text" v-model="lastName" class="form-control" id="last-name" autocomplete="true" required/>
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
                            <label for="role" class="form-label">Role</label>
                            <select placeholder="Select" v-model="selectedRole" class="form-control" id="role">
                                <option disabled selected>Select</option>
                                <option v-for="role in collections.roles" :value="role.id">{{ role.name }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="department" class="form-label">Department</label>
                            <select  placeholder="Select" v-model="selectedDepartment" class="form-control" id="deparment">
                                <option value="null">No department</option>
                                <option v-for="depart in collections.departments" :value="depart.id">{{ depart.name }}</option>
                            </select>
                        </div>
                        <!-- <div class="row">
                            <button type="button" class="btn btn-primary mb-2"  data-bs-target="#change-username-modal" data-bs-toggle="modal">Change username</button>
                            <button type="button" class="btn btn-primary mb-2"  data-bs-target="#change-email-modal" data-bs-toggle="modal">Change email</button>
                            <button type="button" class="btn btn-primary mb-2"  data-bs-target="#change-phone-modal" data-bs-toggle="modal">Change phone</button>
                            <button type="button" class="btn btn-primary mb-2 disabled"  data-bs-target="#change-phone-modal" data-bs-toggle="modal">Reset password</button>
                        </div> -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" :class="{ disabled: isLoading }" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" :class="{ disabled: isLoading }" @click="updateProfile()" class="btn btn-dark">
                            <span :hidden="isLoading">Update</span>
                            <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Delete User Modal -->
    <div class="modal fade" id="delete-user-modal" tabindex="-1"
        aria-labelledby="deleteUserLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content container-bg">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteUserLabel">Delete user!</h1>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        Do you want to continue?
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" :class="{ disabled: isLoading }" class="btn btn-secondary"
                        data-bs-dismiss="modal">No</button>
                    <button type="submit" :class="{ disabled: isLoading }" @click="deleteUser()" class="btn btn-dark">
                        <span :hidden="isLoading">Yes</span>
                        <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="row mb-1">
        <!-- <div class="col-md-4">
            <form class="d-flex" role="search">
                <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Type to search" aria-label="Search">
            </form>
        </div> -->
        <div class="col">
            Role
            <select v-model="selectedRole" @change="getUsers()" class="form-control">
                <option disabled>Select role</option>
                <option value="all">All</option>
                <option v-for="role in collections.roles" :value="role.id">{{ role.name }}</option>
            </select>
        </div>
    </div>

    <div class="row">
        <Progress v-if="isLoading" message="Fetching users" />
        
        <h2 class="p-5 text-center" v-else-if="collections.users == null">
            {{ message }}
        </h2>
        <h2 class="p-5 text-center" v-else-if="collections.users.length == 0">
            {{ message }}
        </h2>
        <table v-else class="table table-hover">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Username</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in collections.users">
                    <td>{{ user.id }}</td>
                    <td>{{ user.first_name }}</td>
                    <td>{{ user.last_name }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.gender }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.role.name }}</td>
                    <td v-if="user.department_id">{{ user.department.name }}</td>
                    <td v-else>NULL</td>
                    <td>
                        <div class="row gx-3">
                            <div class="col">
                                <BIconPenFill @click="preFillUpdatingFields(user)" class="icon-color" data-bs-toggle="modal" data-bs-target="#update-profile-modal" />
                            </div>
                            <div class="col">
                                <BIconTrash class="icon-color" @click="showDeleteModalConfirmation(user)" data-bs-toggle="modal" />
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <select v-model="pagination.records" @change="getUsers()" class="form-control">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        users per page
                    </td>
                    <td>Showing {{ pagination.from }} - {{ pagination.to }} of {{ pagination.total }}</td>
                    <td colspan="7">
    
                        <nav  aria-label="...">
                            <ul class="pagination justify-content-end">
                                <li class="page-item" :class="{ disabled: pagination.firstPageUrl == null }"> 
                                    <span v-if="pagination.firstPageUrl == null" class="page-link">First</span>
                                    <a v-else class="page-link" @click="getUsers(1)">First</a>
                                </li>
                                <li class="page-item" :class="{ disabled: pagination.prevPageUrl == null }">
                                    <span v-if="pagination.prevPageUrl == null" class="page-link">Previous</span>
                                    <a v-else class="page-link" @click="getUsers(--pagination.currentPage)">Previous</a>
                                </li>
                                <li class="page-item" :class="{ active: link.active }" :aria-current="{ page: link.active }" v-for="link in pagination.links">
                                    <span v-if="link.active" class="page-link">{{ link.label }}</span>
                                    <a v-else class="page-link" @click="getUsers()">{{ link.label }}</a>
                                </li>
                                <li class="page-item " :class="{ disabled: pagination.prevPageUrl == null }">
                                    <span v-if="pagination.prevPageUrl == null" class="page-link">Next</span>
                                    <a v-else class="page-link" @click="getUsers(++pagination.currentPage)">Next</a>
                                </li>
                                <li class="page-item " :class="{ disabled: pagination.lastPageUrl == null }"> 
                                    <span v-if="pagination.lastPageUrl == null" class="page-link">Last</span>
                                    <a v-else class="page-link" @click="getUsers(pagination.lastPage)">Last</a>
                                </li>
                            </ul>
                        </nav>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style>

</style>