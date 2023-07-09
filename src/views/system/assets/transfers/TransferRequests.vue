<script>
import Progress from '../../../../components/Progress.vue';
import { BIconTrash, BIconPenFill } from 'bootstrap-icons-vue';
import TransferRequestAssets from './TransferRequestAssets.vue';

export default {
    components: {
        BIconTrash, BIconPenFill, Progress, TransferRequestAssets
    },
    props: ['user'],
    data() {
        return {
            isLoading: false,
            searchQuery: null,
            issueNotes: null,
            message: "Did not fetch assets transfer requests.",

            collections: {
                requests: null,
            },

            pagination: {
                records: 10,
                currentPage: 1,
            },

            //Notification modal
            notification: {
                modal: null,
                title: null,
                message: null,
            },

            activeView: null,
            requestId: null,
        };
    },
    methods: {
        fetchResponseData(res) {
            //First data is axios data, second one is for response sent by backend
            const resData = res.data;
            this.message = resData.message;
            const pageData = resData.data;
            //And this third data is from pagination
            this.collections.requests = pageData.data;

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
        async getTransferRequests() {
            this.isLoading = true;

            let uri = this.api;
            uri += "/assets/transfers/records/";
            uri += this.pagination.records;
            uri += "?page" + this.pagination.currentPage;

            await this.axios.get(uri).then((res) => {
                if (res.status == 200) {
                    this.fetchResponseData(res);
                }
            }).catch((err) => {
                const res = err.response;

                this.message = res.data.message;
            }).finally(() => {
                this.isLoading = false;
            });
        },
        async sign(request) {
            this.isLoading = true;

            const data = {
                "transferId": request.id,
            };

            await this.axios.patch(this.api + "/assets/transfers/sign", data).then((res) => {
                const resData = res.data;console.log(res)
                this.notification.title = "Succeeded";
                this.notification.message = resData.message;
            }).catch((err) => {
                const res = err.response;
                const resData = res.data;
                this.notification.title = "Failed";
                this.notification.message = resData.message;
            }).finally(() => {
                this.isLoading = false;
                this.notification.modal.show();
                this.getTransferRequests();
            });
        },

        showTransferRequestAssets(requestId) {
            this.requestId = requestId;
            this.activeView = TransferRequestAssets;
        }
    },
    mounted() {
        this.getTransferRequests();
        this.notification.modal = this.Modal.getOrCreateInstance(
            document.getElementById("issueNoteNotification"), { backdrop: "static", keyboard: false }
        );
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
    <!-- <div class="row mb-1">
        <div class="col-md-4">
            <form class="d-flex" role="search">
                <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Type to search"
                    aria-label="Search">
            </form>
        </div>
    </div> -->

    <div v-if="activeView == null" class="row">
        <Progress v-if="isLoading" message="Fetching assets transfer requests." />

        <h2 class="p-5 text-center" v-else-if="collections.requests == null">
            {{ message }}
        </h2>
        <h2 class="p-5 text-center" v-else-if="collections.requests.length == 0">
            {{ message }}
        </h2>
        <table v-else class="table table-hover">
            <thead>
                <tr>
                    <th>From department</th>
                    <th>To department</th>
                    <th>Release sign</th>
                    <th>Acceptance sign</th>
                    <th>Dean sign</th>
                    <th>Custodian sign</th>
                    <th>Assets</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="request in collections.requests">
                    <td>{{ request.from_department.name }}</td>
                    <td>{{ request.to_department.name }}</td>
                    <td>
                        <span v-if="request.release_sign">{{ request.release_sign.last_name }}</span>
                        <button v-else-if="user.role.id == 2 && user.department.id == request.from_department.id" @click="sign(request)" class="btn btn-success">
                            Sign 
                        </button>
                    </td>
                    <td>
                        <span v-if="request.acceptance_sign">{{ request.acceptance_sign.last_name }}</span>
                        <button v-else-if="user.role.id == 2 && user.department.id == request.to_department.id" @click="sign(request)" class="btn btn-success">
                            Sign 
                        </button>
                    </td>
                    <td>
                        <span v-if="request.dean_sign">{{ request.dean_sign.last_name }}</span>
                        <button v-else-if="user.role.id == 3" @click="sign(request)" class="btn btn-success">
                            Sign 
                        </button>
                    </td>
                    <td>
                        <span v-if="request.custodian_sign">{{ request.custodian_sign.last_name }}</span>
                        <button v-else-if="user.role.id == 4" @click="sign(request)" class="btn btn-success">
                            Sign 
                        </button>
                    </td>
                    <td>
                        <button @click="showTransferRequestAssets(request.id)" class="btn btn-success">
                            View 
                        </button>
                    </td>
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
                    <td colspan="1">
                        <select v-model="pagination.records" @change="getUsers()" class="form-control">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        transfer requests per page
                    </td>
                    <td>Showing {{ pagination.from }} - {{ pagination.to }} of {{ pagination.total }}</td>
                    <td colspan="5">

                        <nav aria-label="...">
                            <ul class="pagination justify-content-end">
                                <li class="page-item" :class="{ disabled: pagination.firstPageUrl == null }">
                                    <span v-if="pagination.firstPageUrl == null" class="page-link">First</span>
                                    <a v-else class="page-link" @click="getUsers(1)">First</a>
                                </li>
                                <li class="page-item" :class="{ disabled: pagination.prevPageUrl == null }">
                                    <span v-if="pagination.prevPageUrl == null" class="page-link">Previous</span>
                                    <a v-else class="page-link" @click="getUsers(--pagination.currentPage)">Previous</a>
                                </li>
                                <li class="page-item" :class="{ active: link.active }" :aria-current="{ page: link.active }"
                                    v-for="link in pagination.links">
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

    <component v-else :is="activeView" :user="user" :request-id="requestId" @show-transfer-requests="activeView = null" />
</template>

<style></style>