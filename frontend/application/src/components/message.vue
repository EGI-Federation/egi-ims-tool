<template>
    <div class="modal fade" :id="id" :data-bs-backdrop="mustChoose? 'static' : ''" data-bs-keyboard="false" tabindex="-1" aria-labelledby="messageLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div :class="'modal-header' + (titleStyle ? ' text-bg-' + titleStyle : '')">
                    <h1 class="modal-title fs-5" id="messageLabel">{{ title }}</h1>
                    <button type="button" data-bs-dismiss="modal" :aria-label="$t('ims.close')"
                            :class="'btn-close' + (titleStyle && titleStyle !== 'light' && titleStyle !== 'warning' && titleStyle !== 'info' ? ' btn-close-white' : '')">
                    </button>
                </div>
                <div class="modal-body">
                    <p>{{ message }}</p>
                    <textarea v-if="collectMessage" ref="textarea" class="form-control textarea" rows=3
                              v-model="collectedMessage" :maxlength=1024 :required="mustCollectMessage" :placeholder="placeholderCollectMessage"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelAction">{{ cancelButton }}</button>
                    <button v-if="extraButton" type="button" data-bs-dismiss="modal" class="btn btn-primary" @click="extraAction">{{ extraButton }}</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :disabled="!canConfirm" @click="confirmAction">{{ confirmButton }}</button>
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
        titleStyle: {
            type: String, // primary, success, danger, warning, info, light, dark
            default: 'light'
        },
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
        },
        collectMessage: {
            type: Boolean,
            default: false
        },
        placeholderCollectMessage: String,
        mustCollectMessage: {
            type: Boolean,
            default: false
        }
    },
    emits: ['confirm', 'cancel', 'extra'],
    expose: [ 'showModal', 'hideModal' ],
    data() {
        return {
            modal: null,
            collected: ""
        }
    },
    computed: {
        collectedMessage: {
            get() {
                return this.collected;
            },
            set(value) {
                this.collected = value;
            }
        },
        canConfirm() {
            return this.$props.mustCollectMessage ? this.collected.trim().length > 0 : true;
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
            this.$emit('confirm', this.collectedMessage);
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
.modal-body {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
