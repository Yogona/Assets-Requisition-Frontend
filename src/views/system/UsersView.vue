<script>
import CreateUsers from './users/CreateUsers.vue';
import UploadUsers from './users/UploadUsers.vue';
import ViewUsers from './users/ViewUsers.vue';

export default {
  components: {
    CreateUsers, UploadUsers
  },
  props: {
    user: Object,
  },
  data() {
    return {
      currentView: CreateUsers,
      activeView: 'add',
      activePill: {
        add: true,
        upload: false,
        list: false,
      },
    };
  },
  watch: {
    activeView(newView, oldView) {
      this.updateNavHighlight(oldView, false);
      this.updateNavHighlight(newView, true);
      this.changeView(newView);
    }
  },
  methods: {
    changeView(name) {
      switch (name) {
        case 'add': {
          this.currentView = CreateUsers;
        }
          break;

         case 'upload': {
          this.currentView = UploadUsers;
        }
          break;  

         case 'list': {
          this.currentView = ViewUsers;
        }
          break;    
      }
    },
    updateNavHighlight(view, isActive) {
      switch (view) {
        case "add": {
          this.activePill.add = isActive;
        }
          break;

       case "upload": {
          this.activePill.upload = isActive;
        }
          break;   

        case "list": {
          this.activePill.list = isActive;
        }
          break;  
      }
    }
  },
  mounted() {
    this.activeView = 'list';
  }
}
</script>

<template>
  <main>
    <ul class="nav nav-pills justify-content-evenly text-center mb-1">
      <li class="nav-item">
        <button class="nav-link" @click="activeView = 'add'" :class="{active:activePill.add}" :aria-current="{page:activePill.add}">
          Add
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" @click="activeView = 'upload'" :class="{ active: activePill.upload }" :aria-current="{ page: activePill.upload }">
          Upload
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" @click="activeView = 'list'" :class="{ active: activePill.list }" :aria-current="{ page: activePill.list }">
          View
        </button>
      </li>
      <!-- <li class="nav-item">
        <a class="nav-link disabled">Disabled</a>
      </li> -->
    </ul>
    
    <component :is="currentView" />
  </main>
</template>

<style scoped>
.nav-item>a.active{
  background-color: #19A7CE;
}

.nav-item>a{
  color: #19A7CE;
}

.nav-item>a:hover{
  color: #19A7CE;
}
</style>