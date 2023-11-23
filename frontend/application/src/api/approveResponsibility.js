import { ref } from 'vue'
import axios from 'axios'


export const approveResponsibility = function(accessToken, processCode, approve, changeDescription, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const request = async function() {

        try {
            const url = baseUrl + '/responsibilities/approve';
            let data = await axios.patch(url,
                {
                    operation: approve ? 'Approve' : 'Reject',
                    changeDescription: changeDescription
                },
                {
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
            console.error("Error requesting " + processCode + " responsibilities approval");
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, processCode: processCode, error: error, request: request };
}
