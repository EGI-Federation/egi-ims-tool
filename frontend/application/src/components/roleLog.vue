<template>
    <h5>{{ title }}</h5>
    <ul class="role-logs">
        <li v-for="log in roleLogs">
            <div class="d-flex flex-nowrap role-log">
                <div>{{ logInfo(log).opTime }}</div>
                <div><span :class="logInfo(log).pillClass">{{ logInfo(log).pillLabel }}</span></div>
                <div>{{ logInfo(log).opDesc }}</div>
            </div>
        </li>
    </ul>
</template>

<script>
// @ is an alias to /src
import { isValid, formatTime } from '@/utils'

export default {
    name: 'roleLog',
    props: {
        title: String,
        logs: { // Reactive { logs: Array }
            type: Object,
            default: () => {}
        },
    },
    computed: {
        roleLogs() { return this.$props.logs.logs; },
    },
    methods: {
        logInfo(log) {
            return {
                pillClass: "badge rounded-pill " + (log.assigned ? "bg-success" : "bg-danger"),
                pillLabel: this.$t(log.assigned ? "role.assigned" : "role.revoked"),
                opDesc: `${this.$t(log.assigned ? "ims.to" : "ims.from").toLowerCase()} ${log.user.fullName} ${this.$t('ims.by')} ${log.changeBy.fullName}`,
                opTime: formatTime(log.changedOn)
            };
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h5 {
    margin-top: 1rem;
    margin-left: 2rem;
    font-weight: 600;
}
.role-logs {
    list-style-type: none;
}
.role-log {
    gap: 0.25rem;
}
.role-log div {
    padding: 3px 0;
    white-space: nowrap;
}
.role-log div span {
    position: relative;
    top: -2px;
}
</style>
