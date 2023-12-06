import { ref } from 'vue'
import axios from 'axios'


export const readAllMessages = function(accessToken, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const markRead = async function() {

        try {
            const url = `${baseUrl}/messages/read`;
            let data = await axios.patch(url, {},
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            ).catch(function(e) {
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

            response.value = data.data;
        }
        catch(err) {
            console.error(`Error marking all messages as read`);
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, error: error, markRead: markRead };
}
