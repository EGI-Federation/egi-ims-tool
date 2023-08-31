import { ref } from 'vue'
import axios from 'axios'


export const updateProcessInfo = function(accessToken, processCode, processInfo, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const update = async function() {

        try {
            const url = baseUrl + '/process';
            let data = await axios.put(url, processInfo,{
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${accessToken}` }
            });
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            response.value = data.data;
        }
        catch(err) {
            error.value = err.message;
            console.error("Error updating " + processCode + " process info");
        }
    }

    return { response: response, error: error, update: update };
}
