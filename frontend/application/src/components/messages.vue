<template></template>

<script>
// @ is an alias to /src
import { store, storeMessages } from "@/store";
import { isValid, isSuccess, formatSinceEvent } from "@/utils";
import { getMessages } from "@/api/msg/getMessages";
import { countUnreadMessages } from "@/api/msg/countUnreadMessages";

const messagesToAggregate = 5;

export default {
    name: 'messages',
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            messages: store.state.ims?.notifications,
        }
    },
    expose: [ 'loadNotifications', 'checkNotifications' ],
    computed: {
        msgApi() { return process.env.VUE_APP_IMS_MSG_API; },
        messagePageSize() { return parseInt(process.env.VUE_APP_NOTIF_PAGE_SIZE, 10) || 25; },
    },
    methods: {
        loadNotifications(from, announceNewOnes = false) {
            let t = this;
            let gmResult = getMessages(this.accessToken, from, this.messagePageSize, this.msgApi);
            gmResult.load().then(() => {
                if(isSuccess(t, gmResult)) {
                    // Success
                    let newMessages = storeMessages(gmResult);

                    if(announceNewOnes) {
                        let toast = t.$root.$refs.toasts;
                        let tt = t.$t;
                        if(isValid(newMessages)) {
                            if(newMessages.length > messagesToAggregate)
                                // Show just one message saying there are new notifications
                                toast.showInfo(tt('ims.info'),
                                               tt('ims.newNotifications', {count: newMessages.length}));
                            else for(const message of newMessages) {
                                // Show the new messages in toasts
                                const subtitle = formatSinceEvent(message.sentOn, tt);
                                toast.showInfo(tt('ims.info'), message.message, message.url, subtitle);
                            }
                        }
                    }
                }
            });
        },
        checkNotifications() {
            console.log("Checking notifications...");

            // Get the number of unread messages
            let t = this;
            let cmResult = countUnreadMessages(this.accessToken, this.msgApi);
            cmResult.load().then(() => {
                if(isSuccess(t, cmResult)) {
                    // Success
                    const count = cmResult.count.value;
                    if(isValid(count)) {
                        const unread = parseInt(count?.unreadMessages, 10);
                        if(!isNaN(unread))
                            store.commit('ims/updateUnreadNotificationCount', unread);
                    }
                }
            });

            // Get the most recent messages
            this.loadNotifications('now', true);
        }
    },
    created() {
        // Fetch notification messages of current user
        this.checkNotifications();

        // Keep checking periodically
        let t = this;
        const notifyCheck = setTimeout(function() {
            t.checkNotifications();
        }, 180000); // Every 3 minutes
    },
    mounted() {
        //this.$root.$refs.toasts.showInfo(this.$t('ims.info'), "You have 23 new notifications", "/ims/plan/roles")
    },
}
</script>
