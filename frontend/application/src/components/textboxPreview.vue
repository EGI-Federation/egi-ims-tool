<template>
<div>
    <label for="processGoals" class="form-label">
        {{ label }}, {{ $t('textbox.useMarkdown') }} (<a href="https://www.markdown-cheatsheet.com/" target="_blank">{{ $t('textbox.cheatsheet') }}</a>):
    </label>
    <div :class="'text-field mb-1' + (highlight ? ' highlight' : '')" ref="row">
        <textarea ref="textarea" class="form-control textarea" id="processGoals" :rows="rows" :required="required" v-model="textarea"/>
        <div class="sizer" ref="sizer">&nbsp;</div>
        <div v-if="showPreview" class="preview">
            <vue3-markdown-it :source='textarea'/>
        </div>
    </div>
    <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="previewGoals" @click="togglePreview">
        <label class="form-check-label" for="previewGoals">
            {{ $t('textbox.showPreview') }}
        </label>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import VueMarkdownIt from "vue3-markdown-it";

export default {
    name: 'textboxWithPreview',
    components: { VueMarkdownIt },
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
        required: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            preview: false,
            observer: null,
            overhead: 30,
        }
    },
    computed: {
        showPreview: {
            get() { return this.preview; },
            set(value) { this.preview = value; }
        },
        textarea: {
            get() { return this.$props.text.text; },
            set(value) { this.$props.text.text = value; }
        },
    },
    methods: {
        togglePreview() {
            this.showPreview = !this.showPreview;

            const sizer = this.$refs.sizer;
            const taElement = this.$refs['textarea'];
            if(!isValid(taElement) || !isValid(sizer))
                return;

            sizer.style.width = this.showPreview ? "50%" : "100%";

            const delayedSizeAdjust = setTimeout(function() {
                // Resize width of floating textarea to be half/full row
                const sizerSize = sizer.getBoundingClientRect();
                taElement.style.width = sizerSize.width + "px";
                clearTimeout(delayedSizeAdjust);
            }, 100);
        },
        onResize() {
            const ta = this.$refs.textarea;
            if(!isValid(ta))
                return;

            const taSize = ta.getBoundingClientRect();
            this.$refs['row'].style.height = taSize.height + "px";
        },
    },
    mounted() {
        // Watch resize of text area
        this.observer = new ResizeObserver(this.onResize);
        this.observer.observe(this.$refs.textarea);
    },
    beforeDestroy() {
        // Cleanup
        if(isValid(this.observer))
            this.observer.disconnect();
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
    position: absolute;
    z-index: 1;
}
.sizer {
    width: 100%;
    height: 100%;
}
.preview {
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
</style>
