<template>
    <router-link to="/spm/config" class='dropdown-item'>{{ $t('navbar.config') }}</router-link>
    <router-link to="/spm/roles" class='dropdown-item'>{{ $t('navbar.roles') }}</router-link>
    <router-link to="/spm/procedures" class='dropdown-item'>{{ $t('navbar.procedures') }}</router-link>
    <router-link to="/spm/kpis" class='dropdown-item'>{{ $t('navbar.kpis') }}</router-link>
    <hr class='dropdown-divider'/>

</template>

<script>
export default {
    name: 'spmMenu'
}
</script>
