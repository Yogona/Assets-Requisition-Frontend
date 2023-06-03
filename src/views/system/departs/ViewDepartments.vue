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
            departs: null,
            message: "Needs to get departments.",
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
    },
    mounted() {
        this.getDepartments();
    }
}
</script>

<template>
    <div class="row mb-1">
        <div class="col-md-4">
            <form class="d-flex" role="search">
                <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Type to search"
                    aria-label="Search">
            </form>
        </div>
    </div>

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
        </table>
    </div>
</template>

<style></style>