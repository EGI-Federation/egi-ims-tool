<template>
<div class="footer info">
    Footer text comes here {{ version }}
</div>
<hr/>
<div class="footer bottom">
    fsdjlkfhsdjk
</div>
</template>

<script>
// @ is an alias to /src
import Package from "../../package.json";

export default {
    name: 'IsmFooter',
    data() {
        return {
            version: Package.version,
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
    background: #282a2d;
    color: white;
    min-height: 15rem;
    margin-top: auto;
}
hr {
    border-color: white;
    background: white;
}
</style>
