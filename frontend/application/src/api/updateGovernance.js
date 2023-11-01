import { ref } from 'vue'
import axios from 'axios'


export const updateGovernance = function(accessToken, governanceInfo, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const update = async function() {

        try {
            const url = baseUrl + '/governance';
            let data = await axios.put(url, governanceInfo,{
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
            console.error("Error updating IMS governance");
        }
    }

    return { response: response, processCode: 'IMS', error: error, update: update };
}
