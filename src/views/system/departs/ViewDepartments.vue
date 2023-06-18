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
            id: null,
            searchQuery: null,
            departs: null,
            message: "Needs to get departments.",
            toast: null,
            notification: {
                title: null,
                message: null,
            },
            deleteModal: null,
        };
    },
    methods: {
        async getDepartments() {
            this.isLoading = true;

            await this.axios.get(this.api + "/departs").then((res) => {
                if (res.status == 200) {
                    this.departs = res.data.data;
                }
            }).finally(() => {
                this.isLoading = false;
            });
        },
        showDeleteModalConfirmation(depart) {
            this.id = depart.id;
            this.deleteModal = this.Modal.getOrCreateInstance(
                document.getElementById("delete-depart-modal"), { backdrop: "static", keyboard: false }
            );
            this.deleteModal.show();
        },
        async deleteDepartment() {
            this.isLoading = true;

            await this.axios.delete(this.api + "/departs/delete/" + this.id).then((res) => {
                this.notification.title = res.data.message;
                this.notification.message = res.data.data;
                this.getDepartments();
            }).catch((err) => {
                const resData = err.response.data;
                this.notification.title = resData.message;
                this.notification.message = resData.data;
            }).finally(() => {
                this.isLoading = false;
                this.toast.show();
                this.deleteModal.hide();
            });
        },
    },
    mounted() {
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
    <!-- Delete Department Modal -->
    <div ref="deleteModal" class="modal fade" id="delete-depart-modal" tabindex="-1"
        aria-labelledby="deleteDepartmentLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content container-bg">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Delete a department!</h1>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        Do you want to continue?
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"
                        data-bs-dismiss="modal">No</button>
                    <button type="submit" @click="deleteDepartment()" class="btn btn-dark">
                        <span :hidden="isLoading">Yes</span>
                        <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
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

    <div class="row">
        <Progress v-if="isLoading" message="Fetching departments" />

        <h2 class="p-5 text-center" v-else-if="departs == null">
            {{ message }}
        </h2>
        <h2 class="p-5 text-center" v-else-if="departs.length == 0">
            {{ message }}
        </h2>
        <table v-else class="table table-hover">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="depart in departs">
                    <td>{{ depart.id }}</td>
                    <td>{{ depart.name }}</td>
                    <td>{{ depart.description }}</td>
                    <td>
                        <div class="row gx-3">
                            <div class="col">
                                <BIconPenFill @click="preFillUpdatingFields(user)" class="icon-color" data-bs-toggle="modal" data-bs-target="#update-profile-modal" />
                            </div>
                            <div class="col">
                                <BIconTrash class="icon-color" @click="showDeleteModalConfirmation(depart)" data-bs-toggle="modal" />
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style></style>