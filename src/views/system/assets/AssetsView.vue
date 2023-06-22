<script>
import RegisterInstruments from './instruments/RegisterInstruments.vue';
import ViewInstruments from './instruments/ViewInstruments.vue';

export default {
    components: {
        RegisterInstruments, ViewInstruments
    },
    props: {
        user: Object,
    },
    data() {
        return {
            decentUser: null,
            currentView: RegisterInstruments,
            activeView: 'register-instruments',
            activePill: {
                registerInstruments: true,
                viewInstruments: false,
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
                case 'register-instruments': {
                    this.currentView = RegisterInstruments;
                }
                    break;

                case 'view-instruments': {
                    this.currentView = ViewInstruments;
                }
                    break;
            }
        },
        updateNavHighlight(view, isActive) {
            switch (view) {
                case "register-instruments": {
                    this.activePill.registerInstruments = isActive;
                }
                    break;

                case "view-instruments": {
                    this.activePill.viewInstruments = isActive;
                }
                    break;
            }
        },
        checkView() {
            let roleId = this.user.role.id;
            if (roleId != 1 && roleId != 7) {
                this.currentView = viewInstruments;
                this.activePill.viewInstruments = true;
            }
        }
    },
    mounted() {
        // this.checkView();

    }
}
</script>

<template>
    <main>
        <ul class="nav nav-pills justify-content-evenly text-center mb-1">
            <li v-if="user.role.id == 1 || user.role.id == 7" class="nav-item">
                <button class="nav-link" @click="activeView = 'send-note'" :class="{ active: activePill.registerInstruments }"
                    :aria-current="{ page: activePill.registerInstruments }">
                    Register Instruments
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="activeView = 'view-notes'" :class="{ active: activePill.viewInstruments }"
                    :aria-current="{ page: activePill.viewInstruments }">
                    View Instruments
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