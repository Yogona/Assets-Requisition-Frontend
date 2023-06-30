<script>
import { BIconPeople, BIconBuilding } from 'bootstrap-icons-vue';
export default {
    props: ["user"],
    components: {
        BIconPeople, BIconBuilding
    },
    data() {
        return {
            users: 0,
            departs: 0,
            stores: 0,
        };
    },
    methods: {
    },
    async mounted() {
    }
}
</script>

<template>
    <main>
        <div class="h2 text-center">Report</div>
        <div class="container card">
            <div class="row justify-content-center mb-2">
                <div class="col-sm-6">
                    <label>From</label>
                    <input type="date" class="form-control"  />
                </div>
                <div class="col">
                    <label>To</label>
                    <input type="date" class="form-control" />
                </div>
            </div>
            <div class="row mb-2">
                <button class="btn btn-primary">Generate</button>
            </div>
        </div>
    </main>
</template>
<style>
.summary {
    padding: 2em;
}
</style>