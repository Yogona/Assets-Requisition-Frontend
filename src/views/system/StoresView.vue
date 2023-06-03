<script>
import CreateStores from './stores/CreateStores.vue';
import ViewStores from './stores/ViewStores.vue';

export default {
  components: {
    CreateStores, ViewStores
  },
  props: {
    user: Object,
  },
  data() {
    return {
      currentView: CreateStores,
      activeView: 'add',
      activePill: {
        add: true,
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
          this.currentView = CreateStores;
        }
          break;

        case 'list': {
          this.currentView = ViewStores;
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

        case "list": {
          this.activePill.list = isActive;
        }
          break;
      }
    }
  },
  mounted() {
  }
}
</script>

<template>
  <main>
    <ul class="nav nav-pills justify-content-evenly text-center mb-1">
      <li class="nav-item">
        <button class="nav-link" @click="activeView = 'add'" :class="{ active: activePill.add }"
          :aria-current="{ page: activePill.add }">
          Add
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" @click="activeView = 'list'" :class="{ active: activePill.list }"
          :aria-current="{ page: activePill.list }">
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
.nav-item>a.active {
  background-color: #19A7CE;
}

.nav-item>a {
  color: #19A7CE;
}

.nav-item>a:hover {
  color: #19A7CE;
}
</style>