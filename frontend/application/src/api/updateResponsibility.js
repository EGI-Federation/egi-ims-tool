import { ref } from 'vue'
import axios from 'axios'


export const updateResponsibility = function(accessToken, processCode, responsibilityInfo, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const update = async function() {

        try {
            const url = baseUrl + '/responsibilities';
            let data = await axios.put(url, responsibilityInfo,{
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
            console.error("Error updating " + processCode + " responsibilities");
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, processCode: processCode, error: error, update: update };
}
