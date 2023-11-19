import { ref } from 'vue'
import axios from 'axios'


export const sendMessageToUsersWithRole = function(accessToken, processCode, role, message, link, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const notify = async function() {

        try {
            const url = baseUrl + '/messages';
            let data = await axios.post(url, {
                process: processCode,
                role: role,
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
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            response.value = data.data;
        }
        catch(err) {
            console.error(`Error sending message to users with role ${processCode}.${role}`);
        }
    }

    return { response: response, processCode: processCode, error: error, notify: notify };
}
