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
            selectedRole: 'all',
            collections: {
                roles: null,
                users: null,
            },
            message: "Needs to get users.",
            pagination: {
                records: 10,
                currentPage: 1,
            },
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
        }
    },
    mounted() {
        this.getRoles();
        this.getUsers();
    }
}
</script>

<template>
    <div class="row mb-1">
        <div class="col-md-4">
            <form class="d-flex" role="search">
                <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Type to search" aria-label="Search">
            </form>
        </div>
        <div class="col">
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
                            <!-- <div class="col">
                                <BIconPenFill @click="preFillUpdatingFields(user)" class="icon-color" data-bs-toggle="modal" data-bs-target="#update-profile-modal" />
                            </div>
                            <div class="col">
                                <BIconTrash class="icon-color" @click="showDeleteModalConfirmation(user)" data-bs-toggle="modal" />
                            </div> -->
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