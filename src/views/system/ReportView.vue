<script>
import { BIconPeople, BIconBuilding } from 'bootstrap-icons-vue';
export default {
    props: ["user"],
    components: {
        BIconPeople, BIconBuilding
    },
    data() {
        return {
            isLoading: false,
            fromDate: null,
            toDate: null,
            uri: null,
            users: 0,
            departs: 0,
            stores: 0,
        };
    },
    methods: {
        updateUri() {
            this.uri = this.api + "/reports/generate/from/" + this.fromDate + "/to/" + this.toDate;
        }
    },
    async mounted() {
    }
}
</script>

<template>
    <main>
        <div class="h2 text-center">Report</div>
        <div class="container card">{{ uri }}
            <form method="GET" :action="uri" @submit.default="onSubmit">
                <div class="row justify-content-center mb-2">
                    <div class="col-sm-6">
                        <label>From</label>
                        <input type="date" @change="updateUri" v-model="fromDate" class="form-control" required  />
                    </div>
                    <div class="col">
                        <label>To</label>
                        <input type="date" @change="updateUri" v-model="toDate" class="form-control" required />
                    </div>
                </div>
                <div class="row mb-2">
                    <button type="submit" class="btn btn-primary" :class="{disabled:isLoading}" >
                        <span :hidden="isLoading">Generate</span>
                        <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>

            </form>
        </div>
    </main>
</template>
<style>
.summary {
    padding: 2em;
}
</style>