<script>
import SendIssueNote from './requisitions/SendIssueNote.vue';
import ViewIssueNotes from './requisitions/ViewIssueNotes.vue';

export default {
    components: {
        SendIssueNote, ViewIssueNotes
    },
    props: {
        user: Object,
    },
    data() {
        return {
            decentUser: null,
            currentView: SendIssueNote,
            activeView: 'send-note',
            activePill: {
                sendNote: true,
                viewNotes: false,
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
                case 'send-note': {
                    this.currentView = SendIssueNote;
                }
                    break;

                case 'view-notes': {
                    this.currentView = ViewIssueNotes;
                }
                    break;
            }
        },
        updateNavHighlight(view, isActive) {
            switch (view) {
                case "send-note": {
                    this.activePill.sendNote = isActive;
                }
                    break;

                case "view-notes": {
                    this.activePill.viewNotes = isActive;
                }
                    break;
            }
        },
        checkView() {
            let roleId = this.user.role.id;
            if (roleId != 1 && roleId != 7 && roleId != 8) {
                this.currentView = ViewIssueNotes;
                this.activePill.viewNotes = true;
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
            <li v-if="user.role.id == 1 || user.role.id == 7 || user.role.id == 8" class="nav-item">
                <button class="nav-link" @click="activeView = 'send-note'" :class="{ active: activePill.sendNote }"
                    :aria-current="{ page: activePill.sendNote }">
                    Send Note
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="activeView = 'view-notes'" :class="{ active: activePill.viewNotes }"
                    :aria-current="{ page: activePill.viewNotes }">
                    View Notes
                </button>
            </li>
            <!-- <li class="nav-item">
        <a class="nav-link disabled">Disabled</a>
      </li> -->
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