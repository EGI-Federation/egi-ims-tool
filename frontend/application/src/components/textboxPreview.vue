<template>
<div>
    <label for="processGoals" class="form-label">
        {{ label }}, {{ $t('textbox.useMarkdown') }} (<a href="https://www.markdown-cheatsheet.com/" target="_blank">{{ $t('textbox.cheatsheet') }}</a>):
    </label>
    <div :class="'text-field mb-1' + (highlight ? ' highlight' : '')" ref="row">
        <textarea ref="textarea" class="form-control textarea" id="processGoals"
                  :rows="rows" :required="required" :maxlength="maxLength ? maxLength : (1024*1024*10).toString()"
                  v-model="textarea"/>
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
        }
    },
    data() {
        return {
            previewVisible: this.$props.preview,
            overhead: 30,
        }
    },
    computed: {
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
        togglePreview() {
            this.showPreview = !this.showPreview;
            if(this.showPreview)
                this.$refs.textarea. style.width = "calc((100% - .5rem) / 2)";
            else
                this.$refs.textarea. style.width = "100%";
        },
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
</style>
