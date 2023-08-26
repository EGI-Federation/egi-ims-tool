<template>
    <div class="modal fade" :id="id" :data-bs-backdrop="mustChoose? 'static' : ''" data-bs-keyboard="false" tabindex="-1" aria-labelledby="messageLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="messageLabel">{{ title }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="$t('ims.close')"></button>
                </div>
                <div class="modal-body">
                    {{ message }}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelAction">{{ cancelButton }}</button>
                    <button v-if="extraButton" type="button" data-bs-dismiss="modal" class="btn btn-primary" @click="extraAction">{{ extraButton }}</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmAction">{{ confirmButton }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import i18n from "@/locales";
import { Modal } from "bootstrap";

export default {
    name: 'message',
    props: {
        id: {
            type: String,
            default: 'modalDialog'
        },
        title: String,
        message: String,
        confirmButton: {
            type: String,
            default: i18n.global.t('ims.ok')
        },
        extraButton: String,
        cancelButton: {
            type: String,
            default: i18n.global.t('ims.cancel')
        },
        mustChoose: {
            type: Boolean,
            default: true
        }
    },
    emits: ['confirm', 'cancel', 'extra'],
    data() {
        return {
            modal: null,
        }
    },
    methods: {
        showModal() {
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
        confirmAction() {
            this.$emit('confirm');
        },
        extraAction() {
            this.$emit('extra');
        },
        cancelAction() {
            this.$emit('cancel');
        },
    },
    mounted() {
        this.modal = new Modal(`#${this.$props.id}`);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
