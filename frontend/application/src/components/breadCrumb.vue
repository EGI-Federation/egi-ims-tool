<template>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li v-for="segment in segments" :class="'breadcrumb-item' + (null != segment.link ? '' : ' active')">
            <router-link v-if="null != segment.link" :to="segment.link">{{ segment.text }}</router-link>
            <span v-if="null == segment.link">{{ segment.text }}</span>
        </li>
    </ol>
    </nav>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'

export default {
    name: 'breadCrumb',
    props: {
        segments: [] // Contains
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breadcrumb {
    margin-left: 1rem;
    margin-top: .5rem;
}
.breadcrumb-item a {
    text-decoration: none;
}
.breadcrumb > li+li:before {
    width: .6em;
    height: .8em;
    margin-left: .2em;
    margin-right: .6em;
    position: relative;
    top: 4px;
    color: inherit;
    background-color: currentColor;
    content: "";
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5.5 9.5'%3E%3Cpath fill='none' stroke='rgba(0, 0, 0, 0.6)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' d='M.8 8.8l4-4-4-4'/%3E%3C/svg%3E");
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5.5 9.5'%3E%3Cpath fill='none' stroke='rgba(0, 0, 0, 0.6)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' d='M.8 8.8l4-4-4-4'/%3E%3C/svg%3E");
    mask-position: center;
    mask-repeat: no-repeat;
}
</style>
