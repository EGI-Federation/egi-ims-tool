import { ref } from 'vue'
import axios from 'axios'
import { isValid } from "@/utils";

export const getMessages = function(accessToken, from, limit, baseUrl) {
    if('now' !== from) {
        if(typeof from === 'string' || from instanceof String)
            from = new Date(from);
        from = from.format();
    }

    const messages = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + `/messages?from=${from}&limit=${isValid(limit) ? limit : 25}`;
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
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            messages.value = data.data;
        }
        catch(err) {
            console.error("Error getting messages");
        }
    }

    return { page: messages, error: error, load: load };
}
