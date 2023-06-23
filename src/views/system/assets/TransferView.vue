<script>
import AssetsTransferForm from './transfers/AssetsTransferForm.vue';
import TransferRequests from './transfers/TransferRequests.vue';

export default {
    components: {
        AssetsTransferForm, TransferRequests
    },
    props: {
        user: Object,
    },
    data() {
        return {
            decentUser: null,
            currentView: AssetsTransferForm,
            activeView: 'fill-form',
            activePill: {
                assetsTransferForm: true,
                transferRequests: false,
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
                case 'fill-form': {
                    this.currentView = AssetsTransferForm;
                }
                    break;

                case 'requests': {
                    this.currentView = TransferRequests;
                }
                    break;
            }
        },
        updateNavHighlight(view, isActive) {
            switch (view) {
                case "fill-form": {
                    this.activePill.assetsTransferForm = isActive;
                }
                    break;

                case "requests": {
                    this.activePill.transferRequests = isActive;
                }
                    break;
            }
        },
        checkView() {
            let roleId = this.user.role.id;
            if (roleId != 1 && roleId != 2) {
                this.currentView = TransferRequests;
                this.activePill.transferRequests = true;
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
            <li v-if="user.role.id == 1 || user.role.id == 2" class="nav-item">
                <button class="nav-link" @click="activeView = 'fill-form'"
                    :class="{ active: activePill.assetsTransferForm }"
                    :aria-current="{ page: activePill.assetsTransferForm }">
                    Transfer Form
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="activeView = 'requests'"
                    :class="{ active: activePill.transferRequests }" :aria-current="{ page: activePill.transferRequests }">
                    Transfer Requests
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