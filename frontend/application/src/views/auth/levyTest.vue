<template>
    <div>
        This is {{ pagePath }}
    </div>
</template>

<script>

export default {
    name: 'levyTest',
    computed: {
        pagePath() {
            return this.$router.currentRoute?.value.fullPath;
        }
    },
    created () {
        console.log('levyTest : ' + this.pagePath)
    }
}
</script>
