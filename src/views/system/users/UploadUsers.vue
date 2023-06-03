<script>
export default {
    data() {
        return {
            isLoading: false,
            file: null,

            notification: {
                modal: null,
                title: null,
                message: null,
            }
        };
    },
    methods: {
        getAttachedFile(event) {
            this.file = event.target.files[0];
        },
        async uploadUsersFile() {          
            if (this.$refs.fileUploadForm.checkValidity()) {
                this.isLoading = true;

                let formData = new FormData();
                formData.append("users", this.file);

                await this.axios.post(this.api + "/users/upload", formData).then((res) => {
                    const resData = res.data;
                    this.notification.title = "Succeeded"
                    this.notification.message = resData.message;
                }).catch((err) => {
                    const res = err.response;
                    const resData = res.data;

                    if (res.status == 422) {
                        this.notification.title = resData.message;
                        this.notification.message = resData.data;
                    } else {
                        this.notification.title = 'Failed';
                        this.notification.message = resData.message;
                    }
                    
                }).finally(() => {
                    this.isLoading = false;
                    this.notification.modal.show();
                });

            }
        },
    },
    mounted() {
        this.notification.modal = this.Modal.getOrCreateInstance(
            document.getElementById("usersUploadNotification"), { backdrop: "static", keyboard: false }
        );
    }
}
</script>

<template>
    <main>
         <div class="modal fade" id="usersUploadNotification" tabindex="-1" aria-labelledby="uploadUsersLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content container-bg">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="uploadUsersLabel">{{ notification.title }}</h1>
                        <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            {{ notification.message }}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" :class="{ disabled: isLoading }" class="btn btn-secondary"
                            data-bs-dismiss="modal">Ok</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card p-5 m-5">
            <div class="card-header h3 text-center">
                UPLOAD USERS
            </div>
            <form ref="fileUploadForm" @submit.prevent="onSubmit">
                <div class="card-body">
                    <input @change="getAttachedFile($event)" placeholder="Select users file" type="file" accept=".xls,.xlsx" class="form-control mb-2" required />
                    <button class="btn btn-success" type="submit" @click="uploadUsersFile()">
                        <span :hidden="isLoading">Upload Users</span>
                        <div :hidden="!isLoading" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
            
                </div>

            </form>
        </div>
    </main>
</template>

<style></style>