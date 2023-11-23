import { ref } from 'vue'
import axios from 'axios'

export const countUnreadMessages = function(accessToken, baseUrl) {
    const count = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + '/messages/unread';
            let data = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }).catch(function(e) {
                if(e.response) {
                    error.value = {
                        data: e.response.data,
                        status: e.response.status,
                        statusText: e.response.statusText,
                        message: e.message,
                        headers: e.response.headers,
                    }
                }
            });
            if(!data) {
                console.error(error.value?.message);
                throw Error("Error in request " + url + " : " + error.value?.status);
            }

            count.value = data.data;
        }
        catch(err) {
            console.error("Error getting unread message count");
        }
    }

    return { count: count, error: error, load: load };
}
