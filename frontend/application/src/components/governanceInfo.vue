<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap section">
        <div class="governance">
            <governance-header :edit-mode="false" :info="info" :bidirectional="bidirectional"
                               @update="updateGovernance"/>
        </div>
    </div>
    <div class="d-flex flex-nowrap section">
        <div class="governance">
            <div class="details">
                <h3 v-if="!hasDescription">{{ $t('ims.description') }}</h3>
                <vue3-markdown-it v-if="hasDescription" :source='description' />
                <p v-else>{{ $t('ims.notDef') }}</p>

                <h3 id="annexes">{{ $t('gov.annexes') }}</h3>
                <h5 v-if="hasGroups">1. {{ $t('gov.summaryToR') }}</h5>
                <div class="groups">
                    <table-control v-if="hasGroups" id="governance-groups" ref="groups"
                                   :header="groupsHeader" :data="groupsData"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                </div>
            </div>
        </div>
    </div>
    <version-history :bidirectional="bidirectional" view-url="/ims/plan"
                     :version-latest="latest" :version-to-show="current"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import { store, storeGovernanceInfo } from "@/store";
import { isValid, isSuccess, findEntityWithVersion } from '@/utils'
import { getGovernance } from "@/api/getGovernance";
import MarkdownIt from 'markdown-it';
import GovernanceHeader from "@/components/governanceHeader.vue"
import VersionHistory from "@/components/history.vue"
import TableControl, { html } from "@/components/table.vue"
import Message from "@/components/message.vue";

var mdRender = new MarkdownIt();

export default {
    name: 'governanceInfo',
    components: { GovernanceHeader, TableControl, VersionHistory, Message },
    props: {
        apiBaseUrl: String,
        version: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            currentGovernance: store.state.ims?.governanceInfo, // Governance
            groupsHeader: [
                {
                    name: this.$t('gov.body'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.composition'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.meeting'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.decisionVoting'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.interfaces'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                }],
            groupsData: reactive({ rows: [] }),
            info: reactive({ current: this.currentGovernance }),
            bidirectional: reactive({ historyVisible: false }),
        }
    },
    computed: {
        latest() { return store.state.ims?.governanceInfo; },
        current() { return this.currentGovernance; },
        hasDescription() {
            return isValid(this.current) && isValid(this.current.description) &&
                this.current.description.trim().length > 0;
        },
        description() {
            return this.hasDescription ? this.current.description : "";
        },
        hasGroups() {
            return isValid(this.current) && isValid(this.current.groups) &&
                this.current.groups.length > 0;
        },
        groups() {
            let r = [];
            if(isValid(this.current) && isValid(this.current.groups)) {
                for(const ann of this.current.groups) {
                    let interfaces = "";
                    if(isValid(ann.interfaces)) {
                        for(let itf of ann.interfaces) {
                            if(interfaces.length > 0)
                                interfaces += ",<br/>";

                            interfaces += itf.interfacesWith;
                            if(isValid(itf.comment) && itf.comment.length > 0)
                                interfaces += ` ${itf.comment}`;
                        }
                    }

                    let row = [
                        isValid(ann.body) ? ann.body : "",
                        isValid(ann.composition) ? ann.composition : "",
                        isValid(ann.meeting) ? ann.meeting : "",
                        isValid(ann.decisionVoting) ? ann.decisionVoting : "",
                        interfaces
                    ];
                    r.push(row);
                }
            }
            return r;
        },
    },
    methods: {
        setupTables() {
            this.groupsData.rows = this.groups;
            this.$refs.groups?.forceUpdate();
        },
        updateGovernance() {
            this.$router.push("/ims/plan/update");
        },
    },
    created() {
        // Fetch the governance information from the API
        let t = this;
        const giResult = getGovernance(this.accessToken, true, this.$props.apiBaseUrl);
        giResult.load().then(() => {
            if(isSuccess(t, giResult)) {
                // Success
                storeGovernanceInfo(giResult);

                let current = store.state.ims.governanceInfo;
                if(isValid(current)) {
                    const requested = this.$props.version;
                    if(isValid(requested) && requested.length > 0) {
                        // Make sure we show the correct version
                        let requestedVersion = findEntityWithVersion(current, requested);
                        if(isValid(requestedVersion))
                            current = requestedVersion;
                        else
                            console.log(`Cannot find governance v${requested}`);
                    }

                    console.log(`Showing governance v${current.version}`);
                }
                this.currentGovernance = current;
                this.info.current = this.currentGovernance;
                this.setupTables();
            }
        });
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
    position: relative;
    gap: .5rem;
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
    min-height: unset;
}

@media screen and (min-width: 765px) {
    .content {
        min-height: calc(100vh - var(--navbar-height) - var(--breadcrumb-height));
    }
}

.content .section {
    width: 100%;
    max-width: calc(2rem + var(--max-content-width));
    margin: 0 auto 2rem;
}
.content .section:first-of-type {
    margin-bottom: 0;
}
.content .governance {
    width: 100%;
    position: relative;
    margin: 0 auto;
}
.governance .details {
    text-align: left;
    padding: 0.5rem 1rem 0;
}
.governance .details h3,
.governance .reviews h3 {
    border-bottom: 1px solid var(--bs-secondary-bg);
}
.governance .groups {
    margin-bottom: 1rem;
}
</style>
