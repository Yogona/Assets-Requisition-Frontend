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
    async getContentCounters() {
      await this.axios.get(this.api + "/counter").then((res) => {
        const resData = res.data;
        this.users = resData.users;
        this.departs = resData.departs;
        this.stores = resData.stores;
      });
    }
  },
  async mounted() {
    await this.getContentCounters();
  }
}
</script>

<template>
  <main>
    <div class="row gy-5 justify-content-evenly pt-5">
      <div v-if="user.role == 1" class="container-bg white-text col-md-4 summary">
        <div class="row justify-content-center text-center">
          <BIconPeople />
          <span>{{ users }} Users</span>
        </div>
      </div>

      <div v-if="user.role == 1" class="container-bg white-text col-md-4 summary">
        <div class="row justify-content-center text-center">
          <BIconBuilding />
          <span>{{ departs }} Departments</span>
        </div>
      </div>

      <div class="container-bg white-text col-md-4 summary">
        <div class="row justify-content-center text-center">
          <BIconBuilding />
          <span>{{ stores }} Stores</span>
        </div>
      </div>
    </div>
  </main>
</template>
<style>
.summary{
  padding: 2em;
}
</style>