<template>
<div class="card">
    <div class="card-header">
        {{ title }}
    </div>
    <div class="card-body">
        <h6 class="card-subtitle">{{ code }} </h6>
        <p class="card-text"><a :href="link" target="_blank" class="card-link">{{ standard }}</a></p>
        <p class="card-text text-body-secondary">{{ description }}</p>
        <p class="card-subtitle mt-2 scope"><strong>{{ $t('welcome.scope') }}</strong>: {{ scope }}</p>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
export default {
    name: 'IsmComponent',
    props: {
        title: String,
        code: String,
        standard: String,
        link: String,
        description: String,
        scope: String
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
    width: 25%;
    min-width: 10rem;
    max-width: 17rem;
    margin-top: 0;
    margin-bottom: 0;
}
.card-header {
    background-color: aliceblue;
    font-weight: bold;
    align-content: center;
    min-height: 4rem;
}
.card-body {
    background-color: #f8f8f8;
    border-bottom-left-radius: .5rem;
    border-bottom-right-radius: .5rem;
}
.card-body,
.scope {
    font-size: smaller;
}
</style>
