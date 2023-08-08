<template>
<ism-navbar process-code="SLM" :process-menu="processMenu()"/>
</template>

<script>
// @ is an alias to /src
import IsmNavbar from "@/components/navbar.vue";

export default {
    name: 'slmNavbar',
    components: { IsmNavbar },
    methods: {
        processMenu() {
            let menu = [];
            menu.push({ isSeparator: false, text: this.$t('navbar.config'), link: "/slm/config" });
            menu.push({ isSeparator: false, text: this.$t('navbar.roles'), link: "/slm/roles" });
            menu.push({ isSeparator: false, text: this.$t('navbar.procedures'), link: "/slm/procedures" });
            menu.push({ isSeparator: false, text: this.$t('navbar.kpis'), link: "/slm/kpis" });
            menu.push({ isSeparator: true });
            menu.push({ isSeparator: false, text: this.$t('slm.navbar.catalogs'), link: "/slm/config" });
            menu.push({ isSeparator: false, text: this.$t('slm.navbar.slas'), link: "/slm/slas" });
            menu.push({ isSeparator: false, text: this.$t('slm.navbar.olas'), link: "/slm/olas" });
            menu.push({ isSeparator: false, text: this.$t('slm.navbar.uas'), link: "/slm/uas" });
            menu.push({ isSeparator: false, text: this.$t('slm.navbar.reports'), link: "/slm/reports" });
            return menu;
        }
    }
}
</script>
