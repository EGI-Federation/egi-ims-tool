<template>
<div>
    <label for="wrapper" class="form-label">
        {{ label }}, {{ $t('textbox.useMarkdown') }}
        (<a href="https://www.markdown-cheatsheet.com/" target="_blank">{{ $t('textbox.cheatsheet') }}</a>):
    </label>
    <div :class="'text-field mb-1' + (highlight ? ' highlight' : '')" ref="row">
        <div ref="wrapper" id="wrapper"
             :style="`width:${showPreview ? 'calc((100% - .5rem) / 2)' : '100%'};`">
            <textarea class="form-control textarea" ref="textarea"
                      :rows="rows" :required="required" :maxlength="maxLength ? maxLength : (1024*1024*10).toString()"
                      v-model="textarea"/>
            <div v-if="upload" :class="showPreview ? 'upload preview' : 'upload'" ref="upload"
                 @click="selectImage($event)">
                <i class="bi bi-card-image" data-bs-toggle='tooltip' :data-bs-title="$t('textbox.uploadImage')"></i>
            </div>
        </div>
        <div v-if="showPreview" class="preview">
            <vue3-markdown-it :source='textarea' :html="html || upload"/>
        </div>
    </div>
    <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="preview" :checked="showPreview"
               @click="togglePreview">
        <label class="form-check-label" for="preview">
            {{ $t('textbox.showPreview') }}
        </label>
    </div>
    <form v-if="upload" class="upload-form" ref="imageForm">
        <input type="file" id="imageFile" ref="imageFile" :accept="fileFormats" :multiple="false"
               @change="imageSelected($event)"/>
        <button type="submit" ref="uploadImage" @click="uploadImage($event)">Upload</button>
    </form>
</div>
</template>

<script>
// @ is an alias to /src
import { isSuccess, isValid } from "@/utils";
import { uploadCheck } from '@/api/msg/uploadCheck';
import { uploadImage } from "@/api/msg/uploadImage";
import { store } from "@/store";
import { Tooltip } from "bootstrap";
import VueMarkdownIt from "vue3-markdown-it"

export default {
    name: 'textboxWithPreview',
    components: { VueMarkdownIt, Tooltip },
    props: {
        label: String,
        text: Object,
        rows: {
            type: Number,
            default: 5
        },
        highlight: {
            type: Boolean,
            default: false
        },
        preview: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        maxLength: {
            type: Number,
            default: null
        },
        html: { // Allow inline HTML in markdown
            type: Boolean,
            default: false
        },
        upload: { // Allow embedding images, when set it implies inline HTML is enabled
            type: Boolean,
            default: false
        },
        maxUploadSize: {
            type: Number,
            default: 2 * 1024 * 1024 // 2 MB
        }
    },
    emits: [ 'tooBigToUpload', 'imageExists' ],
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            previewVisible: this.$props.preview,
            overhead: 30,
            image: null,
            tooltips: [],
        }
    },
    computed: {
        imgApi() { return process.env.VUE_APP_IMS_MSG_API; },
        fileFormats() {
            return ".jpg,.jpeg,.png,.webp,.bmp,.tiff";
        },
        showPreview: {
            get() { return this.previewVisible; },
            set(value) { this.previewVisible = value; }
        },
        textarea: {
            get() { return this.$props.text.text; },
            set(value) { this.$props.text.text = value; }
        },
    },
    methods: {
        hideTooltips() {
            for(let tooltip of this.tooltips)
                tooltip.hide();
        },
        togglePreview() {
            this.showPreview = !this.showPreview;
            if(this.showPreview) {
                this.$refs.wrapper.style.width = "calc((100% - .5rem) / 2)";
                this.$refs.upload?.classList.add('preview');
            }
            else {
                this.$refs.wrapper.style.width = "100%";
                this.$refs.upload?.classList.remove('preview');
            }
        },
        selectImage(event) {
            this.$refs.imageFile.click();
        },
        imageSelected(event) {
            let files = this.$refs.imageFile;
            if(isValid(files) && files.files.length > 0) {
                this.image = files.files[0];
                if(this.image.size > this.$props.maxUploadSize) {
                    // Image file too big
                    this.$emit('tooBigToUpload', {
                        name: this.image.name,
                        size: this.image.size });
                } else {
                    // Check if an image with this name was already uploaded
                    let t = this;
                    let icResult = uploadCheck(this.accessToken, this.image.name, this.image.size, this.imgApi);
                    icResult.check().then(() => {
                        if(isValid(icResult.error?.value))
                            t.$emit('imageExists', t.image.name);
                        else
                            // Upload possible, submit upload form
                            t.$refs.uploadImage.click();
                    });
                }
            }
        },
        uploadImage(event) {
            console.log(`Uploading ${this.fileName}`);

            let t = this;
            let ta = this.$refs.textarea;
            let uiResult = uploadImage(this.accessToken, this.image, this.imgApi);
            uiResult.upload().then(() => {
                if(isSuccess(t, uiResult)) {
                    // Upload successful, add inline HTML at current position in the markdown editor
                    // If something is selected, it will be replaced by the inline HTMl for the image
                    let imageMarkdown = "<p style='text-align:center;'>" +
                                        "<img src='/images/" + t.image.name +"' style='max-width:40rem;'/>" +
                                        "</p>";

                    ta.focus();
                    if(isValid(ta.setRangeText))
                        ta.setRangeText(imageMarkdown);
                    else
                        document.execCommand('insertText', false /*no UI*/, imageMarkdown);

                    this.$props.text.text = ta.value;

                    t.image = null;
                }
            });

            event.preventDefault();
            event.stopPropagation();
        }
    },
    mounted() {
        // Init the tooltip(s)
        const tooltipTriggers = document.querySelectorAll(`.upload [data-bs-toggle='tooltip']`);
        this.tooltips = [...tooltipTriggers].map(tooltipTrigger =>
            new Tooltip(tooltipTrigger, {
                delay: { "show": 1000, "hide": 100 },
                trigger: 'hover'
            }));
    },
    beforeUnmount() {
        this.hideTooltips();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text-field {
    display: flex;
    flex-wrap: nowrap;
    gap: .5rem;
    position: relative;
}
.highlight {
    background-color: #f8f9fa;
}
.textarea {
    min-width: 15rem;
    height: 100%;
    overflow-y: auto;
}
.upload {
    position: absolute;
    width: 2rem!important;
    height: 2rem;
    top: 5px;
    right: 15px;
    z-index: 10;
    border-radius: .3rem;
    padding-top: 3px;
    font-size: var(--font-size-h3);
    text-align: center;
    color: white;
    background-color: var(--bs-primary);
    cursor: pointer;
}
.upload.preview {
    right: calc(100% / 2 + .25rem + 15px);
}
.preview {
    width: calc((100% - .5rem) / 2);
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
}
.preview::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}
.form-label {
    margin-bottom: .25rem;
}
label.form-check-label {
    position: relative;
    top: 2px;
}
.upload-form input[type='file'] {
    position: fixed;
    top: -10vh;
}
.upload-form button {
    visibility: hidden;
}
</style>
