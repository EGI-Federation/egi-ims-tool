import { ref } from 'vue'
import axios from 'axios'


export const getProcess = function(accessToken, processCode, allVersions, baseUrl) {
    const processInfo = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + '/process' + (allVersions ? '?allVersions=true' : '');
            let data = await axios.get(url, {
                headers: {
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

            processInfo.value = data.data;
        }
        catch(err) {
            console.error("Error getting " + processCode + " process");
        }
    }

    return { processInfo: processInfo, processCode: processCode, error: error, load: load };
}
