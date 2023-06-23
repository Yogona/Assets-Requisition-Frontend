<script>
import RegisterAssets from './assets/RegisterAssets.vue';
import ViewAssets from './assets/ViewAssets.vue';

export default {
    components: {
        RegisterAssets, ViewAssets
    },
    props: {
        user: Object,
    },
    data() {
        return {
            decentUser: null,
            currentView: RegisterAssets,
            activeView: 'register-assets',
            activePill: {
                registerAssets: true,
                viewAssets: false,
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
                case 'register-assets': {
                    this.currentView = RegisterAssets;
                }
                    break;

                case 'view-assets': {
                    this.currentView = ViewAssets;
                }
                    break;
            }
        },
        updateNavHighlight(view, isActive) {
            switch (view) {
                case "register-assets": {
                    this.activePill.registerAssets = isActive;
                }
                    break;

                case "view-assets": {
                    this.activePill.viewAssets = isActive;
                }
                    break;
            }
        },
        checkView() {
            let roleId = this.user.role.id;
            if (roleId != 1 && roleId != 4) {
                this.currentView = ViewAssets;
                this.activePill.viewAssets = true;
            }
        }
    },
    mounted() {
        this.checkView();
    }
}
</script>

<template>
    <main>
        <ul class="nav nav-pills justify-content-evenly text-center mb-1">
            <li v-if="user.role.id == 1 || user.role.id == 4" class="nav-item">
                <button class="nav-link" @click="activeView = 'register-assets'" :class="{ active: activePill.registerAssets }"
                    :aria-current="{ page: activePill.registerAssets }">
                    Register Assets
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="activeView = 'view-assets'" :class="{ active: activePill.viewAssets }"
                    :aria-current="{ page: activePill.viewAssets }">
                    View Assets
                </button>
            </li>
        </ul>

        <component :is="currentView" :user="user" />
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