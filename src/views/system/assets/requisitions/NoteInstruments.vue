<script>
import Progress from '../../../../components/Progress.vue';
import { BIconTrash, BIconPenFill } from 'bootstrap-icons-vue';

export default {
    components: {
        BIconTrash, BIconPenFill, Progress
    },
    props: ['user', 'noteCode', 'isSigned'],
    emits: ['showIssueNotes'],
    data() {
        return {
            isLoading: false,
            searchQuery: null,
            issueNotes: null,
            message: "Needs to get note instruments",

            collections: {
                noteInstruments: null,
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
            }
        };
    },
    methods: {
        fetchResponseData(res) {
            //First data is axios data, second one is for response sent by backend
            const resData = res.data;
            this.message = resData.message;
            const pageData = resData.data;
            //And this third data is from pagination
            this.collections.noteInstruments = pageData.data;

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
        async getNoteInstruments() {
            this.isLoading = true;

            let uri = this.api;
            uri += "/instruments/note/"+this.noteCode+"/records/";
            uri += this.pagination.records;
            uri += "?page=" + this.pagination.currentPage;

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
        async register(itemCode) {
            this.isLoading = true;
            const data = { itemCode: itemCode };
            await this.axios.post(this.api + "/instruments/note/"+this.noteCode+"/register", data).then((res) => {
                const resData = res.data;console.log(resData)
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
            });
        }
    },
    mounted() {
        this.getNoteInstruments();
        this.notification.modal = this.Modal.getOrCreateInstance(
            document.getElementById("registerInstrumentNotification"), { backdrop: "static", keyboard: false }
        );
    }
}
</script>

<template>
    <div class="modal fade" id="registerInstrumentNotification" tabindex="-1" aria-labelledby="createIssueNoteLabel"
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

    <button class="btn btn-secondary" @click="$emit('showIssueNotes')" aria-current="page">
        Back to Issue Notes
    </button>
    <div class="row">
        <Progress v-if="isLoading" message="Fetching note instruments" />

        <h2 class="p-5 text-center" v-else-if="collections.noteInstruments == null">
            {{ message }}
        </h2>
        <h2 class="p-5 text-center" v-else-if="collections.noteInstruments.length == 0">
            {{ message }}
        </h2>
        <table v-else class="table table-hover">
            <thead>
                <tr>
                    <th>Item Code</th>
                    <th>Description</th>
                    <th>Unit</th>
                    <th>Requested</th>
                    <th>Supplied</th>
                    <!-- <th>Store Officer sign</th> -->
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="instrument in collections.noteInstruments">
                    <td>{{ instrument.item_code }}</td>
                    <td>{{ instrument.item_description }}</td>
                    <td>{{ instrument.issue_unit }}</td>
                    <td>{{ instrument.requested }}</td>
                    <td>{{ instrument.supplied }}</td>
                    <td>
                        <button v-if="!instrument.registered && isSigned && (user.role.id == 1 || user.role.id == 4) && instrument.supplied == null" class="btn btn-success" @click="register(instrument.item_code)">
                            Register
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
                    <td colspan="3">
                        <select v-model="pagination.records" @change="getUsers()" class="form-control">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        items per page
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

<style></style>