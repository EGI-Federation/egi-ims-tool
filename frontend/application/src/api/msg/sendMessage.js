import { ref } from 'vue'
import axios from 'axios'


export const sendMessage = function(accessToken, processCode, user, message, link, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const notify = async function() {

        try {
            const url = baseUrl + '/messages';
            let data = await axios.post(url, {
                checkinUserId: user.checkinUserId,
                message: message,
                category: processCode,
                url: link,
            },{
                headers: {
                    "Content-Type": 'application/json',
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

            response.value = data.data;
        }
        catch(err) {
            console.error(`Error sending ${processCode} notification to user ${user.fullName}`);
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, processCode: processCode, error: error, notify: notify };
}
