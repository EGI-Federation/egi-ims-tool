import { ref } from 'vue'
import axios from 'axios'


export const getProcessInfo = function(accessToken, processCode, allVersions, baseUrl) {
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
            });
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            processInfo.value = data.data;
        }
        catch(err) {
            error.value = err.message;
            console.error("Error getting " + processCode + " process info");
        }
    }

    return { processInfo: processInfo, processCode: processCode, error: error, load: load };
}
