import { ref } from 'vue'
import axios from 'axios'


export const deprecateProcess = function(accessToken, processCode, user, message, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const request = async function() {

        try {
            const url = baseUrl + '/process';
            let data = await axios.delete(url, {
                headers: {
                    "Content-Type": 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                data: {
                    changeBy: user,
                    changeDescription: message,
                }
            }).catch(function(e) {
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
            console.error("Error deprecating " + processCode + " process");
        }
    }

    return { response: response, error: error, request: request };
}
