<script>
import { RouterLink, RouterView } from 'vue-router';
import {
  BIconHouse,
  BIconBuilding,
  BIconPeople,
  BIconShop,
  BIconPersonBadgeFill,
  BIconCollection
} from 'bootstrap-icons-vue';

export default {
  components: {
    BIconHouse, BIconBuilding, BIconPeople, BIconShop, BIconPersonBadgeFill, BIconCollection
  },
  data() {
    return {
      isLoading: false,
      
      user: null,
      pathname: "/",
      nav: {
        home: true,
        users: false,
        departments: false,
        stores: false,
        assets: {
          mark: false,
          requisitions: false,
          registration: false,
          transfers: false,
          reports: false,
        }
      },
      modals: {
        logoutModal: null,
      },
    };
  },
  watch: {
    pathname(newVal, oldVal){
      this.updateNavHighlight(oldVal, false);
      this.updateNavHighlight(newVal, true);
    }
  },
  methods: {
    async checkAuthenticStatus() {
      this.axios.get(this.api + "/user").then((res) => {
        this.isLoading = true;
        if (res.status == 200) {
          this.user = res.data;
          this.$router.push(this.pathname);
        }
      }).catch((err) => {
        if (err.response.status == 401) {
          this.$router.push("/");
        }
      }).finally(() => {
        this.isLoading = false;
      });
    },
    async changeLocation(path) {
      this.pathname = path;
      await this.checkAuthenticStatus();
    },
    resetAssetsNav() {
      this.nav.assets.requisitions  = false;
      this.nav.assets.registration  = false;
      this.nav.assets.transfers     = false;
      this.nav.assets.reports       = false;
    },
    updateAssetsNav(view) {
      this.resetAssetsNav();

      switch (view) {
        case 'requisitions': {
          this.changeLocation("/requisitions");
          this.nav.assets.requisitions = true;
        } break;

        case 'registration': {
          this.changeLocation("/assets-registration");
          this.nav.assets.registration = true;
        } break;

        case 'transfers': {
          this.changeLocation("/transfers");
          this.nav.assets.transfers = true;
        } break;

        case 'reports': {
          this.changeLocation("/reports");
          this.nav.assets.reports = true;
        } break;
      }
    },
    showLogoutModal() {
      this.modals.logoutModal = this.Modal.getOrCreateInstance(
        document.getElementById("logout-modal"), { backdrop: "static", keyboard: false }
      );
      this.modals.logoutModal.show();
    },
    async logout() {
      this.isLoading = true;

      await this.axios.post(this.api + "/logout").then((res) => {
        this.modals.logoutModal.hide();
        this.$router.push("/");
        this.user = null;
      }).catch((err) => {
        this.feedBack.title = "Error occured!";
        this.feedBack.message = err.response.data.message;
      }).finally(() => {
        this.isLoading = false;
        this.toast.show();
      });
    },
    updateNavHighlight(path, isActive) {
      if (path == "/home") {
        this.nav.home = isActive;
      } else if (path == "/users") {
        this.nav.users = isActive;
      } else if (path == "/departments") {
        this.nav.departments = isActive;
      } else if (path == "/stores") {
        this.nav.stores = isActive;
      } else if (path == "/requisitions" || "/registration" || "/transfers" || "/reports") {
        this.nav.assets.mark = isActive;
      } 
    },
  },
  computed: {
    dynamicColClassDueToNavPresence(){
      return (this.user) ? "col-md-10" : "col-md-12";
    },
  },
  async mounted() {
    this.pathname = location.pathname;
    await this.checkAuthenticStatus();
  },
}
</script>

<template>
   <!-- Logout Modal -->
  <div v-if="user" ref="logoutModal" class="modal fade" id="logout-modal" tabindex="-1"
      aria-labelledby="logoutLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content container-bg">
              <div class="modal-header">
                  <h1 class="modal-title fs-5" id="logoutLabel">Logout!</h1>
                  <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                      aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  <div class="mb-3">
                      Do you want to proceed?
                  </div>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary"
                      data-bs-dismiss="modal">No</button>
                  <button type="submit" @click="logout()" class="btn btn-dark">
                      <span :hidden="isLoading">Yes</span>
                      <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                          <span class="visually-hidden">Loading...</span>
                      </div>
                  </button>
              </div>
          </div>
      </div>
  </div>

  <div class="row justify-content-between">
    <div v-if="user" class="col">
      <div id="navbar" class="container-bg sticky-top">
        <div class="h1 text-center">
          <a class="navbar-brand" href="#">ARTMS</a>
        </div>
        <nav id="left-nav" class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#leftNavContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="leftNavContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0 flex-column">
                <li class="nav-item">
                  <RouterLink class="col nav-link" :class="{ active: nav.home }" :aria-current="{ page: nav.home }" @click="changeLocation('/home')" to="/home">
                    <div class="row justify-content-center text-center">
                      <BIconHouse />
                      <span class="col">Home</span>
                    </div>
                  </RouterLink>
                </li>
                <li v-if="user.role.id == 1" class="nav-item">
                  <RouterLink class="col nav-link" :class="{ active: nav.users }" :aria-current="{ page: nav.users }" @click="changeLocation('/users')" to="/users">
                    <div class="row justify-content-center text-center">
                      <BIconPeople />
                      <span class="col">Users</span>
                    </div>
                  </RouterLink>
                </li>
                <li v-if="user.role.id == 1" class="nav-item">
                  <RouterLink class="nav-link col" :class="{ active: nav.departments }" :aria-current="{ page: nav.departments }" @click="changeLocation('/departments')" to="/departments">
                    <div class="row justify-content-center text-center">
                      <BIconBuilding />
                      <span class="col">Departments</span>
                    </div>
                  </RouterLink>
                </li>
                <!-- <li v-if="user.role.id == 1" class="nav-item">
                  <RouterLink class="nav-link col" :class="{ active: nav.stores }" :aria-current="{ page: nav.stores }" @click="changeLocation('/stores')" to="/stores">
                    <div class="row justify-content-center text-center">
                      <BIconBuilding />
                      <span class="col">Stores</span>
                    </div>
                  </RouterLink>
                </li> -->
                <li class="nav-item dropdown">
                  <a class="nav-link" role="button" :class="{ active: nav.assets.mark }" aria-expanded="false">
                    <div class="row justify-content-center text-center">
                      <BIconCollection />
                      Assets
                    </div>
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <RouterLink to="/requisitions" @click="updateAssetsNav('requisitions')" class="dropdown-item" :class="{ active: nav.assets.requisitions }">
                        Requisitions
                      </RouterLink>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <RouterLink to="/assets-registration" @click="updateAssetsNav('registration')" class="dropdown-item" :class="{ active: nav.assets.registration }">
                        Registration
                      </RouterLink>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <RouterLink to="/transfers" @click="updateAssetsNav('transfers')" class="dropdown-item" :class="{ active: nav.assets.transfers }">
                        Transfers
                      </RouterLink>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <RouterLink to="reports" @click="updateAssetsNav('reports')" class="dropdown-item disabled" :class="{ active: nav.assets.reports }">
                        Reports
                      </RouterLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div class="row mx-2">
          <button @click="showLogoutModal()" class="btn btn-success " type="button">
            Logout
          </button>
        </div>
      </div>

    </div>
    <div :class="dynamicColClassDueToNavPresence">
      <div class="row">
        <div id="topBar" class="row justify-content-center mb-2 sticky-top" v-if="user">
          <a class="nav-link text-center" role="button">
            <BIconPersonBadgeFill style="font-size: 2rem;" />
            {{ user.first_name }} {{ user.last_name }} - {{ user.role.name }}
          </a>
        </div>
        <div>
          <RouterView @location-change="(newPath) => { changeLocation(newPath); checkAuthenticStatus(); }" :user="user" />
        </div>
      </div>
    </div>

  </div>
</template>

<style>
body {
  background-color: #F6F1F1;
  width: 100%;
  height: 100%;
  color: black;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 0px 0px;
}

#topBar a.nav-link{
  padding-left: 0;
  margin-left: 0;
}

#topBar{
  background-color: #146C94;
  color: #F6F1F1;
  width: 68rem;
  height: 3em;
}

.dropdown:hover .dropdown-menu{
  display: block;
}

@media(min-width: 850px) {
  #navbar{
    height: 39.1rem;
  }
}

</style>

