<template>
<div :class="routerClass">
    <router-link :to="route">
        <div :class="cardClass">
            <div class="card-body">
                <p class="card-text card-icon"><i :class="cardIcon"></i></p>
                <p class="card-text">{{ title }}</p>
            </div>
        </div>
    </router-link>
</div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'

export default {
    name: 'IsmModule',
    props: {
        title: String,
        icon: String,
        code: String,
        active: false
    },
    data() {
        return {
            route: this.code.toLowerCase()
        }
    },
    computed: {
        routerClass() { return isValid(this.active) ? "" : " no-route"; },
        cardClass() { return "card" + (!isValid(this.active) ? " disabled" : ""); },
        cardIcon() { return "bi bi-" + this.icon; }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.no-route {
    pointer-events: none;
}
.card {
    --card-font-size: calc(5 * var(--font-scale) * var(--bs-body-font-size));
    width: 4.5rem;
    min-width: 10rem;
    margin: 0 auto;
    border-radius: 1rem;
    background-color: #00004b;
}
.card:hover {
    background-color: darkblue;
}
.disabled,
.disabled:hover {
    background-color: gray;
    cursor: default!important;
}
.card-body {
    border-radius: 1rem;
}
a {
    text-decoration: none;
}
.card-icon {
    font-weight: bold;
    font-size: var(--card-font-size);
    align-content: center;
    margin: 1.5rem 0;
}
.card-icon,
.card-text {
    color: white;
    min-height: calc(4.5 * var(--card-font-size)/5);
    margin: 0 auto;
}
</style>
