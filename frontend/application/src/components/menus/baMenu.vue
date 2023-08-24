<template>
    <router-link to="/ba" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/ba/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/ba/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/ba/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'baMenu',
}
</script>
