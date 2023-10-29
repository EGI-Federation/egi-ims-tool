<template>
<div :id="id" class="position-fixed bottom-0 end-0 p-3 toast-container">
    <div v-for="toast in toasts" :id="toast.id" class="toast fade bg-solid-white" :data-bs-delay="toast.delay"
         role="alert" aria-live="assertive" aria-atomic="true">
        <div :class="'toast-header ' + (toast.headClass ? toast.headClass : '')">
            <strong class="me-auto">{{ toast.title }}</strong>
            <small class="text-body-tertiary">{{ toast.subtitle }}</small>
            <button type="button" :class="'btn-close ' + (toast.closeClass ? toast.closeClass : '')" data-bs-dismiss="toast" :aria-label="$t('ims.close')"></button>
        </div>
        <div :class="'toast-body ' + (toast.bodyClass ? toast.bodyClass : '')">{{ toast.message }}</div>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import { Toast } from "bootstrap";

export default {
    name: 'toastMessages',
    props: {
        id: String
    },
    expose: [ 'showToast', 'showSuccess', 'showError' ],
    data() {
        return {
            notifications: [], // { id, title, subtitle, message, class, delay, visible }
        }
    },
    computed: {
        toasts() { return this.notifications; },
    },
    methods: {
        showToast(title, message, subtitle, headClass, closeClass, bodyClass, delay = 5000) {
            this.notifications.push({
                id: 'toast-' + Math.floor(1000 * Math.random()),
                title: title,
                message: message,
                headClass: headClass,
                closeClass: closeClass,
                bodyClass: bodyClass,
                delay: delay });
        },
        showSuccess(title, message, subtitle, bodyClass) {
            this.notifications.push({
                id: 'toast-' + Math.floor(1000 * Math.random()),
                title: title,
                message: message,
                headClass: 'text-bg-success',
                closeClass: 'btn-close-white',
                bodyClass: bodyClass,
                delay: 3000 });
        },
        showError(title, message, subtitle, bodyClass) {
            this.notifications.push({
                id: 'toast-' + Math.floor(1000 * Math.random()),
                title: title,
                message: message,
                headClass: 'text-bg-danger',
                closeClass: 'btn-close-white',
                bodyClass: bodyClass,
                delay: 5000 });
        },
    },
    watch: {
        // Whenever question changes, this function will run
        'notifications.length'(newLen, oldLen) {
            if(oldLen < newLen) {
                // Wait for the toast to render on the page before activating it
                let t = this;
                const delayedSetup = setTimeout(function() {
                    clearTimeout(delayedSetup);
                    const hiddenToasts = t.notifications.filter((toast) => { return toast.visible !== true; });
                    for(let toastInfo of hiddenToasts) {
                        let toastElement = document.getElementById(toastInfo.id);
                        let toast = new Toast(toastElement);
                        toast.show();
                        toastInfo.visible = true;

                        toastElement.addEventListener("hidden.bs.toast", function() {
                            const indexOfObject = t.notifications.findIndex((toast) => { return toast.id === toastInfo.id; });
                            if(indexOfObject >= 0)
                                t.notifications.splice(indexOfObject, 1);
                        });
                    }
                }, 100);
            }
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toast-container {
    z-index: 25;
}
.toast-container > :not(:last-child) {
    margin-bottom: .5rem;
}
.bg-solid-white {
    background-color: whitesmoke!important;
}
</style>
