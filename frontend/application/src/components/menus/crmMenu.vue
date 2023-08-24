<template>
    <router-link to="/crm" class='dropdown-item'>{{ $t('navbar.process') }}</router-link>
    <router-link to="/crm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/crm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/crm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>

export default {
    name: 'crmMenu',
}
</script>
