<template>
<div class="content">
    <div>
        <form class="needs-validation" novalidate ref="responsibilityForm">
        <div class="responsibility">
            <responsibility-header ref="responsibilityHeader" :edit-mode="true" :info="info" :bidirectional="bidirectional"
                                   @save="saveChanges($event)" @cancel="cancelChanges"/>
            <div class="details">
                <!-- Commit message -->
                <div class="text-field mb-3">
                    <label for="changeDesc" class="form-label">{{ $t('ims.changeDesc') }}:</label>
                    <textarea ref="textarea" class="form-control textarea" id="changeDesc" rows=3
                              v-model="changeDescription" :maxlength=1024 required/>
                    <div class="invalid-feedback">{{ $t('ims.invalidEntityChange',
                                                        { entity: $t('ims.responsibility').toLowerCase() }) }}</div>
                </div>

                <h3>{{ $t('ims.general') }}</h3>

                <div class="input-group mb-3 flex-nowrap gap-2">
                    <!-- Review frequency -->
                    <div class="input-group flex-column flex-nowrap frequency">
                        <label for="reviewFrequency" class="form-label">{{ $t('ims.reviewFreq') }}:</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="reviewFrequency"
                                   v-model="reviewFrequency" required>
                            <button class="btn btn-outline-secondary text-nowrap dropdown-toggle" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                {{ reviewFrequencyUnitName }}</button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#"
                                       @click="updateReviewFrequencyUnit('day', $event)">
                                    {{ $t('ims.days') }}
                                </a></li>
                                <li><a class="dropdown-item" href="#"
                                       @click="updateReviewFrequencyUnit('month', $event)">
                                    {{ $t('ims.months') }}
                                </a></li>
                                <li><a class="dropdown-item" href="#"
                                       @click="updateReviewFrequencyUnit('year', $event)">
                                    {{ $t('ims.years') }}
                                </a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Next review -->
                    <div class="input-group review-date">
                        <div class="text-field">
                            <label for="nextReview" class="form-label">{{ $t('ims.nextReview') }}:</label>
                            <VueDatePicker v-if="reviewFrequencyUnit === 'day'" id="nextReview" v-model="nextReview"
                                           text-input auto-apply class="focus-ring" required :enable-time-picker="false"
                                           month-name-format="long" :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false,
                                                          showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="dd/MM/yyyy" format="dd/MM/yyyy"/>

                            <VueDatePicker v-if="reviewFrequencyUnit === 'month'" id="nextReview" v-model="nextReview"
                                           month-picker text-input auto-apply
                                           month-name-format="long" :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false,
                                                          showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="MM/yyyy"/>

                            <VueDatePicker v-if="reviewFrequencyUnit === 'year'" id="nextReview" v-model="nextReview"
                                           year-picker text-input auto-apply :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false,
                                                          showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="yyyy"/>
                        </div>
                    </div>
                </div>
                <!-- Description -->
                <h3>{{ $t('ims.description') }}</h3>
                <textbox-with-preview class="mt-1" :label="$t('role.respLabel')" :text="descriptionEditor"
                                      :rows="10" :max-length=10240 required/>
            </div>
        </div>
        </form>
    </div>
    <message id="warnEditResponsibility" ref="warnEditResponsibility"
             :title="$t('ims.unsavedChanges')" :message="$t('ims.warnEditing')"
             :confirm-button="$t('ims.continue')" @confirm="abandonChanges" />
</div>
</template>

<script>
// @ is an alias to /src
import i18n from "@/locales";
import { reactive } from 'vue';
import { store, storeProcessResponsibilities } from "@/store";
import { isValid, isSuccess, strEqual, deepClone, scrollTo } from '@/utils'
import { getResponsibility } from "@/api/getResponsibility";
import { updateResponsibility } from "@/api/updateResponsibility";
import MarkdownIt from 'markdown-it';
import ResponsibilityHeader from "@/components/responsibilityHeader.vue"
import TextboxWithPreview from "@/components/textboxPreview.vue"
import Message from "@/components/message.vue"

var mdRender = new MarkdownIt();

export default {
    name: 'responsibilityEdit',
    components: { ResponsibilityHeader, TextboxWithPreview, Message },
    props: {
        processCode: String,
        apiBaseUrl: String,
        info: { // Reactive { current: Responsibility, approved: Responsibility }
            type: Object,
            default: () => {}
        },
        state: { // Reactive { hasUnsavedChanges: Boolean, navigateTo: String }
            type: Object,
            default: () => {}
        }
    },
    expose: [ 'warnUnsavedChanges' ],
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            bidirectional: reactive({ responsibilityChanged: false }),
            responsibilityInfo: null, // Responsibility
            descriptionEditor: reactive({ text: isValid(this.edited) ? this.edited.description : "" }),
            forceCancel: false,
        }
    },
    computed: {
        i18n() { return i18n },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        latest() { return store.state.ims?.responsibilityInfo; },
        edited() {
            if(!isValid(this.responsibilityInfo) && isValid(this.current)) {
                this.responsibilityInfo = deepClone(this.current);
                this.responsibilityInfo.changeDescription = "";
                this.responsibilityInfo.changeBy = null;
                delete this.responsibilityInfo['id'];
                delete this.responsibilityInfo['changedOn'];
                delete this.responsibilityInfo['history'];

                this.descriptionEditor.text = this.responsibilityInfo.description;
            }

            return this.responsibilityInfo;
        },
        changeDescription: {
            get() { return isValid(this.edited) ? this.edited.changeDescription : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.changeDescription = value;
            },
        },
        reviewFrequency: {
            get() { return isValid(this.edited) ? this.edited.reviewFrequency : 1; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.reviewFrequency = value;
            },
        },
        reviewFrequencyUnit() {
            if(isValid(this.edited))
                switch(this.edited.frequencyUnit) {
                    case 'day':
                    case 'year':
                        return this.edited.frequencyUnit;
                }
            return 'month';
        },
        reviewFrequencyUnitName() {
            let unit = this.$t('ims.years');
            if(isValid(this.edited))
                switch(this.edited.frequencyUnit) {
                    case 'day':
                        unit = this.$t('ims.days');
                        break;
                    case 'month':
                        unit = this.$t('ims.months');
                        break;
                }
            return unit;
        },
        nextReview: {
            get() {
                let date = Date.now();
                if(isValid(this.edited)) {
                    date = new Date(this.edited.nextReview);
                    switch(this.edited.frequencyUnit) {
                        case 'year': return date.getFullYear();
                        case 'month': return { year: date.getFullYear(), month: date.getMonth() }
                    }
                }

                return date;
            },
            set(value) {
                if(value instanceof Date) {
                    value.setHours(8);
                    value = value.toISOString();
                }
                else if(typeof(value) === "number") {
                    // Got a year
                    value = new Date(value, 3, 1, 8).toISOString();
                }
                else if(isValid(value.year) || isValid(value.month)) {
                    // Got { month: 0, year: 2023 }
                    value = new Date(value.year, value.month, 1, 8).toISOString();
                }

                if(isValid(this.edited))
                    this.edited.nextReview = value;
            },
        },
        responsibilityChanged() {
            if(!isValid(this.current) || !isValid(this.edited))
                return false;

            const pc = this.current;
            const pe = this.edited;

            if (!strEqual(pc.description, this.descriptionEditor.text) ||
                pc.reviewFrequency !== pe.reviewFrequency ||
                pc.frequencyUnit !== pe.frequencyUnit ||
                pc.nextReview !== pe.nextReview || // String
                pc.status !== pe.status)
                return true;

            return false;
        },
        systemProcess() {
            return 'IMS' === this.$props.processCode;
        },
        returnToRoute() {
            return `/${this.$props.processCode.toLowerCase()}${this.systemProcess ? '/plan' : ''}/roles`;
        },
    },
    watch: {
        responsibilityChanged(changed) {
            this.bidirectional.responsibilityChanged = changed;
            this.$props.state.hasUnsavedChanges = changed && !this.forceCancel;
        },
        forceCancel() {
            this.$props.state.hasUnsavedChanges = false;
        }
    },
    methods: {
        updateReviewFrequencyUnit(value, event) {
            event.preventDefault();
            this.dpUnhookFocus();
            if(isValid(this.edited))
                this.edited.frequencyUnit = value;

            let t = this;
            const delayedRehookFocus = setTimeout(function() {
                clearTimeout(delayedRehookFocus);
                t.dpHookFocus();
            }, 500);
        },
        addHaloFocusIn(event) {
            let el = event.target;
            el.classList.add("focus-ring");
            el.classList.add("form-control");
            el.classList.add("form-control-fix");
        },
        removeHaloFocusOut(event) {
            let el = event.target;
            el.classList.remove("focus-ring");
        },
        dpHookFocus() {
            this.dpInput = document.querySelector(".dp__input");
            this.dpInput.addEventListener('focusin', this.addHaloFocusIn);
            this.dpInput.addEventListener('focusout', this.removeHaloFocusOut);
        },
        dpUnhookFocus() {
            if(!isValid(this.dpInput))
                this.dpInput = document.querySelector(".dp__input");

            this.dpInput.removeEventListener('focusin', this.addHaloFocusIn);
            this.dpInput.removeEventListener('focusout', this.removeHaloFocusOut);
        },
        setupValidation(scope) {
            const forms = document.querySelectorAll(`${isValid(scope) ? scope : ''}.needs-validation`)
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if(!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    form.classList.add('was-validated');
                }, false);
            })
        },
        saveChanges(event) {
            if(this.$refs.responsibilityForm.checkValidity()) {
                if(!this.responsibilityChanged)
                    this.cancelChanges();
                else {
                    // We have changes to the responsibilities that must be saved as another version
                    console.log(`Saving ${this.$props.processCode} process responsibility changes`);

                    this.responsibilityInfo.description = this.descriptionEditor.text;
                    if(isValid(this.responsibilityInfo.changeBy)) {
                        delete this.responsibilityInfo.changeBy['kind'];
                        delete this.responsibilityInfo.changeBy['given_name'];
                        delete this.responsibilityInfo.changeBy['family_name'];
                        delete this.responsibilityInfo.changeBy['email_verified'];
                    }

                    // Call API to update process responsibilities
                    let t = this;
                    const ruResult = updateResponsibility(this.accessToken, this.$props.processCode,
                                                          this.responsibilityInfo, this.$props.apiBaseUrl);
                    ruResult.update().then(() => {
                        if(isSuccess(t, ruResult)) {
                            // Success
                            console.log("Created new responsibility version");
                            t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                             t.$t('ims.newEntityVersion', {
                                                                 entity: t.$t('ims.responsibility').toLowerCase()
                                                             }));

                            // Fetch process responsibilities from the API to include the added version
                            const riResult = getResponsibility(t.accessToken, this.$props.processCode, true,
                                                               t.$props.apiBaseUrl);
                            riResult.load().then(() => {
                                if(isSuccess(t, riResult)) {
                                    // Success
                                    storeProcessResponsibilities(riResult);
                                    t.forceCancel = true;
                                    t.$router.push(t.returnToRoute);
                                }
                            });
                        }
                    });
                }
                event.preventDefault();
                event.stopPropagation();
            }
        },
        cancelChanges() {
            this.$router.push(this.returnToRoute);
        },
        warnUnsavedChanges() {
            this.$refs.warnEditResponsibility.showModal();
        },
        abandonChanges() {
            this.forceCancel = true;
            this.$router.push(isValid(this.$props.state.navigateTo) ?
                              this.$props.state.navigateTo :
                              this.returnToRoute);
        },
    },
    mounted() {
        // Add halo ring on focus to the date picker
        this.dpHookFocus();
        this.setupValidation();
    },
    beforeDestroy() {
        // Cleanup
        this.dpUnhookFocus();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
    position: relative;
    gap: .5rem;
    width: 100%;
    min-height: unset;
}

@media screen and (min-width: 765px) {
    .content {
        min-height: calc(100vh - var(--navbar-height) - var(--breadcrumb-height));
    }
}

.content > div {
    width: 100%;
    max-width: var(--max-content-width);
    margin: 0 auto 2rem;
}
.responsibility {
    margin: 0 auto;
    position: relative;
}
.details {
    text-align: left;
    padding-left: 1rem;
    padding-right: 1rem;
}
.details h3 {
    border-bottom: 1px solid #e9ecef;
}
.details .text-field {
    width: 100%;
}
.form-label {
    margin-bottom: .25rem;
}
.responsibility .groups {
    margin-bottom: 1rem;
    gap: 0;
}
.responsibility .groups h5 {
    margin-top: 1rem;
    margin-bottom: 0;
}
.details .frequency {
    min-width: 8rem;
    max-width: 12rem;
}
.details .frequency button {
    width: 6rem;
    text-align: left;
}
.details .review-date {
    max-width: 15rem;
}
.check-item .form-check-input,
.check-item .form-check-label {
    cursor: pointer;
}
.dropdown-menu {
    background-color: var(--menu-background-color);
    font-size: calc(var(--font-scale) * var(--bs-dropdown-font-size));
}
.dropdown-menu > li:hover,
.dropdown-menu > li:focus,
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
    background-color: var(--menu-item-color);
}
</style>
