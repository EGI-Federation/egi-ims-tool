<template>
    <ims-navbar ref="navbar"/>
    <div class="page-container">
        <div class="page">
            <bread-crumb :segments="locationSegments"/>
            <div class="content">
                <div class="d-flex flex-column flex-nowrap gap-2 messages">
                    <!-- Header -->
                    <div class="title">
                        <h3>{{ $t('ims.yourNotifications') }}</h3>
                        <p v-if="unreadNotificationCount > 0">{{ $t('ims.newNotifications', { count: unreadNotificationCount }) }}</p>
                        <button v-if="unreadNotificationCount > 0" type="button"
                                class="btn btn-primary text-nowrap float-left"
                                @click="markAllRead">
                            {{ $t('ims.markAllRead') }}
                        </button>
                    </div>
                    <!-- Unread -->
                    <div v-for="(message, index) in unreadNotifications" class="message">
                        <a :class="messageInfo(message, index).class" :href="messageInfo(message).url"
                           @click="handleNotificationLink(message.id, $event)">
                            <div class="d-flex flex-nowrap gap-1 message-details">
                                <div class="d-flex flex-nowrap gap-1">
                                    <div class="icon" :style="`background-color:${messageInfo(message).iconBackground};color:${messageInfo(message).iconColor}`">
                                        <div>
                                            <span :class="messageInfo(message).iconClass"/>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column gap-1">
                                        <div class="notification">{{ message.message }}</div>
                                        <div class="when">{{ formatSinceEvent(message.sentOn, $t) }}</div>
                                    </div>
                                </div>
                                <div class="message-action">
                                    <button v-if="!message.wasRead" type="button" class="btn btn-primary text-nowrap"
                                            @click="markRead(message.id, $event)">
                                        {{ $t('ims.markRead') }}
                                    </button>
                                </div>
                            </div>
                        </a>
                    </div>
                    <!-- Older -->
                    <div v-for="(message, index) in olderNotifications" class="message">
                        <a :class="messageInfo(message, index).class" :href="messageInfo(message).url"
                           @click="handleNotificationLink(message.id, $event)">
                            <div class="d-flex flex-nowrap gap-1">
                                <div class="icon" :style="`background-color:${messageInfo(message).iconBackground};color:${messageInfo(message).iconColor}`">
                                    <div>
                                        <span :class="messageInfo(message).iconClass"/>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1">
                                    <div class="notification earlier">{{ message.message }}</div>
                                    <div class="when">{{ formatSinceEvent(message.sentOn, $t) }}</div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <!-- More -->
                    <div v-if="!messagesEnd" class="more">
                        <button type="button" class="btn btn-primary text-nowrap" @click="loadMore">{{ $t('ims.loadMore') }}</button>
                    </div>
                    <p v-if="messagesEnd && 0 === totalNotificationCount">{{ $t('navbar.noMessagesExplicit') }}</p>
                </div>
            </div>
        </div>
        <ims-footer/>
    </div>
</template>

<script>
// @ is an alias to /src
import { store  } from "@/store"
import { isValid, isSuccess, formatSinceEvent } from "@/utils";
import { readMessage } from "@/api/readMessage";
import { readAllMessages } from "@/api/readAllMessages";
import { Icons, IconColors } from "@/notify";
import imsNavbar from "@/components/navbar.vue";
import imsFooter from "@/components/footer.vue";
import BreadCrumb from "@/components/breadCrumb.vue";

export default {
    name: 'notifications',
    components: { imsFooter, imsNavbar, BreadCrumb },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            locationSegments: [
                { text: this.$t("home.home"), link: "/" },
                { text: this.$t("navbar.notifications") },
            ],
        }
    },
    computed: {
        msgApi() { return process.env.VUE_APP_IMS_MSG_API; },
        totalNotificationCount() {
            const total = store.state.ims?.notifications?.length;
            return isValid(total) ? total : 0;
        },
        unreadNotificationCount() {
            const unread = store.state.ims?.notificationsUnread;
            return isValid(unread) ? unread : 0;
        },
        unreadNotifications() { return store.getters["ims/unreadNotifications"]; },
        olderNotifications() { return store.getters["ims/olderNotifications"]; },
        messagesEnd() { return store.state.ims.notificationsEnd; }
    },
    methods: {
        formatSinceEvent,
        messageInfo(message, index) {
            return {
                class: `${isValid(message.url) ? '' : ' nolink'}`,
                url: isValid(message.url) ? message.url : '#',
                iconClass: Icons[message.category || 'IMS'],
                iconBackground: IconColors[message.category || 'IMS'],
                iconColor: 'white'
            };
        },
        handleNotificationLink(messageId, event) {
            let el = event.target;
            while(el.nodeName !== 'A')
                el = el.parentElement;

            const url = el.getAttribute("href");
            if(isValid(url) && url.charAt(0) !== '#') {
                // Notification has a link, navigate using the router
                this.markRead(messageId);
                this.$router.push(url);

                event.preventDefault();
                event.stopPropagation();
            }
        },
        markRead(messageId, event) {
            let t = this;
            let rmResult = readMessage(this.accessToken, messageId, this.msgApi);
            store.commit('ims/markNotificationsRead', Array.of(messageId));
            rmResult.markRead().then(() => {
                if(isSuccess(t, rmResult)) {
                    // Success, nothing to do
                }
            });

            event.preventDefault();
            event.stopPropagation();
        },
        markAllRead() {
            let t = this;
            let notifications = this.$refs.navbar?.$refs?.notifications;
            let rmResult = readAllMessages(this.accessToken, this.msgApi);
            store.commit('ims/markNotificationsRead');
            rmResult.markRead().then(() => {
                if(isSuccess(t, rmResult)) {
                    // Success, reload the notifications
                    if(isValid(notifications))
                        notifications.checkNotifications();
                }
            });
        },
        loadMore() {
            let notifications = this.$refs.navbar?.$refs?.notifications;
            if(isValid(notifications)) {
                const lastMessage = store.state.ims.notifications[store.state.ims.notifications.length - 1];
                notifications.loadNotifications(lastMessage.sentOn);
            }
        },
    },
    created() {

    },
    mounted() {
        scroll(0, 0);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
    position: relative;
    width: 100%;
    min-height: unset;
}
.messages {
    width: 100%;
    max-width: var(--max-content-width);
    margin: 0 auto 2rem;
    padding: 0 1rem;
}
.title {
    position: relative;
}
.title h3 {
    margin-bottom: 0;
}
.title p {
    margin-bottom: .5rem;
}
.float-left {
    margin-bottom: 1rem;
}

@media screen and (min-width: 765px) {
    .content {
        min-height: calc(100vh - var(--navbar-height) - var(--breadcrumb-height));
    }
    .messages {
        padding: 0 2rem;
    }
    .float-left {
        position: absolute;
        top: 0;
        left: 0;
    }
}

.message {
    padding: 1rem 1rem;
    background-color: var(--bs-tertiary-bg);
    border-radius: var(--bs-border-radius)!important;
    text-align: left;
}
.message:hover {
    background-color: var(--bs-secondary-bg);
}
.message-details {
    flex-direction: row;
    justify-content: space-between;
}
.message-action {
    margin-left: 1rem;
}

@media screen and (max-width: 435px) {
    .message-details {
        flex-direction: column;
        justify-content: unset;
    }
    .message-action {
        display: flex;
        justify-content: right;
    }
}

.message a {
    text-decoration: none;
}
.message .nolink {
    cursor: default;
}
.message .icon {
    --icon-height: calc(2 * var(--font-scale) * var(--bs-body-font-size));
    --icon-diameter: calc(var(--icon-height) + 1rem);
    font-size: var(--icon-height);
    font-weight: bold;
    width: var(--icon-diameter);
    min-width: var(--icon-diameter);
    max-height: var(--icon-diameter);
    margin-right: .4rem;
    -moz-border-radius: calc(var(--icon-diameter) / 2);
    -webkit-border-radius: calc(var(--icon-diameter) / 2);
    border-radius: calc(var(--icon-diameter) / 2);
}
.message .icon > div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: .3rem;
}
.message .notification {
    white-space: normal;
    color: var(--primary-text-color);
}
.message .notification.earlier {
    color: var(--bs-secondary-color);
    opacity: .75;
}
.message .when {
    font-size: smaller;
    color: var(--bs-secondary-color);
    opacity: .75;
}
.more {
    margin-top: 1rem;
}
</style>
