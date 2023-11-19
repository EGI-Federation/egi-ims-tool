import { ref } from 'vue'
import axios from 'axios'


export const readMessage = function(accessToken, messageId, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const markRead = async function() {

        try {
            const url = `${baseUrl}/message/${messageId}/read`;
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
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            response.value = data.data;
        }
        catch(err) {
            console.error(`Error marking message ${messageId} as read`);
        }
    }

    return { response: response, error: error, markRead: markRead };
}
