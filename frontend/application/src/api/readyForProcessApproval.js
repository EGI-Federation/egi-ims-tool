import { ref } from 'vue'
import axios from 'axios'


export const markProcessReadyForApproval = function(accessToken, processCode, user, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const request = async function() {

        try {
            const url = baseUrl + '/process/readyforapproval';
            let data = await axios.patch(url, user,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            response.value = data.data;
        }
        catch(err) {
            error.value = err.message;
            console.error("Error requesting " + processCode + " process approval");
        }
    }

    return { response: response, error: error, request: request };
}
