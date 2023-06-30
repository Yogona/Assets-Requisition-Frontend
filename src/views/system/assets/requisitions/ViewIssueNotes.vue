<script>
import Progress from '../../../../components/Progress.vue';
import { BIconTrash, BIconPenFill } from 'bootstrap-icons-vue';
import NoteInstruments from "./NoteInstruments.vue";

export default {
    components: {
        BIconTrash, BIconPenFill, Progress, NoteInstruments
    },
    props: ['user'],
    data() {
        return {
            isLoading: false,
            isSigned: false,
            searchQuery: null,
            issueNotes: null,
            message: "Needs to get requisition issue notes",

            collections: {
                issueNotes: null,
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
            noteCode: null,
        };
    },
    methods: {
        fetchResponseData(res) {
            //First data is axios data, second one is for response sent by backend
            const resData = res.data;
            this.message = resData.message;
            const pageData = resData.data;
            //And this third data is from pagination
            this.collections.issueNotes = pageData.data;

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
        async getIssueNotes() {
            this.isLoading = true;

            let uri = this.api;
            uri += "/issue-notes/records/";
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
        async sign(noteCode) {
            this.isLoading = true;

            const data = {
                "note_code": noteCode,
            };

            await this.axios.patch(this.api + "/issue-notes/sign", data).then((res) => {
                const resData = res.data;
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
                this.getIssueNotes();
            });
        },

        showNoteInstruments(noteCode, isSigned) {
            this.noteCode = noteCode;
            this.activeView = NoteInstruments;
            this.isSigned = isSigned;
        }
    },
    mounted() {
        this.getIssueNotes();
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
        <Progress v-if="isLoading" message="Fetching issue notes" />

        <h2 class="p-5 text-center" v-else-if="collections.issueNotes == null">
            {{ message }}
        </h2>
        <h2 class="p-5 text-center" v-else-if="collections.issueNotes.length == 0">
            {{ message }}
        </h2>
        <table v-else class="table table-hover">
            <thead>
                <tr>
                    <th>Note Code</th>
                    <!-- <th>Store</th> -->
                    <th>Department</th>
                    <th>Requester</th>
                    <th>HOD sign</th>
                    <th>Store Officer sign</th>
                    <th>Assets</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="note in collections.issueNotes">
                    <td>{{ note.note_code }}</td>
                    <!-- <td>{{ note.store.name }}</td> -->
                    <td>{{ note.department.name }}</td>
                    <td>{{ note.requester.first_name }}</td>
                    <td>
                        <button v-if="note.hod_signature == null && (user.role.id == 2 || user.role.id == 3 || user.role.id == 5)" class="btn btn-success" @click="sign(note.note_code)">
                            Sign
                        </button>
                        <span v-else-if="note.hod_signature != null">{{ note.hod_signature.last_name }}</span>
                    </td>
                    <td>
                        <button v-if="note.store_officer_signature == null && (user.role.id == 8)" class="btn btn-success" @click="sign(note.note_code)">
                            Sign
                        </button>
                        <span v-else-if="note.store_officer_signature != null"> {{ note.store_officer_signature.last_name }} </span>
                    </td>
                    <td>
                        <button v-if="user.role.id == 1 || user.role.id == 2 || user.role.id == 3 || user.role.id == 5 || user.role.id == 8 || (user.role.id == 4 && note.hod_signature != null && note.store_officer_signature != null)" class="btn btn-success" @click="showNoteInstruments(note.note_code, (note.hod_signature != null && note.store_officer_signature != null))">
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
                    <td>
                        <select v-model="pagination.records" @change="getUsers()" class="form-control">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        notes per page
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

    <component v-else :is="activeView" :is-signed="isSigned" :user="user" :note-code="noteCode" @show-issue-notes="activeView = null" />
</template>

<style></style>