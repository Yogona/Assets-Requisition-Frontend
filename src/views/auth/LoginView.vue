<script>
import { BIconBoxArrowDownRight, BIconBoxArrowInRight } from 'bootstrap-icons-vue';
export default {
  props: ['user'],
  emits: ['locationChange', 'user'],
  components: {
    BIconBoxArrowDownRight,
    BIconBoxArrowInRight
},
  data() {
    return {
      username: null,
      password: null,
      error: null,
      isLoading: false,
      status: 200,
      res: {
        success: false,
        message: null,
        data: null,
      },
    }
  },
  methods: {
    validate() {
      if (this.username != null && this.password != null) {
        return true;
      }

      return false;
    },
    async login() {
      if (this.validate()) {
        this.isLoading = true;
        this.error = null;

        await this.axios.get(this.origin + "/sanctum/csrf-cookie").then((res) => {
          this.status = res.status;
        }).catch((err) => {
          
        });

        if (this.status == 204) {
          await this.axios.post(this.api + "/login", {
            "username": this.username,
            "password": this.password
          }).then((res) => {
            if (res.status == 202) {
              this.$emit("locationChange", '/home');
            }

          }).catch((err) => {
            // const resData;
            this.res = err.response.data;
            this.error = this.res.message;
          }).finally(() => {
            this.password = null;
          });

        }

        this.isLoading = false;
      }
    },
  },
  mounted() {
    // alert("mounted");
    // this.username = "hello";
  },

}
</script>

<template>
  <div class="text-center h2">
    <span class="mb-1">ARDHI UNIVERSITY</span>
  </div>
  <div class="text-center h4">
    <strong class="mb-5 text-center">ASSESTS REQUISITION AND TRANSFER SYSTEM</strong>
  </div>

  <div id="login-pane" class="container-bg white-text">
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input 
          type="text" v-model="username" class="form-control" id="username" aria-describedby="username" autocomplete="true" required/>
        </div>
        <div class="mb-1">
          <label for="password" class="form-label">Password</label>
          <input type="password" v-model="password" class="form-control" id="password" autocomplete="true" required/>
        </div>
        <div v-if="error" class="text-center mb-2">
          <span  class="error text-center">* {{  error }}</span>
        </div>
        <div class="row">
          <button type="submit" @click="login" class="btn">
            <span :hidden="isLoading">Login <BIconBoxArrowInRight class="icon" /></span>
            <div :hidden="!isLoading" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
        </div>
      </form>
  </div>
</template>

<style>

@media(min-width:720px){
  #login-pane{
    width: 500px;
    padding: 50px 50px 50px 50px;
    position: relative;
    left: 25rem;
    top: 5rem;
  }
  /* body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 10fr 1fr;
    padding: 0 2rem;
  } */
}
</style>
