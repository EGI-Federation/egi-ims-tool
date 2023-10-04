import { ref } from 'vue'
import axios from 'axios'


export const markProcessReadyForApproval = function(accessToken, processCode, user, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const request = async function() {

        try {
            const url = baseUrl + '/process/readyforapproval';
            let data = await axios.patch(url,
                {
                    changeBy: user
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            ).catch(function(e) {
                if(e.response) {
                    error.value = {
                        data: e.response.data,
                        status: e.response.status,
                        message: e.response.statusText,
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
            console.error("Error requesting " + processCode + " process approval");
        }
    }

    return { response: response, error: error, request: request };
}
