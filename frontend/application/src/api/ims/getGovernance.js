import { ref } from 'vue'
import axios from 'axios'


export const getGovernance = function(accessToken, allVersions, baseUrl) {
    const governanceInfo = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + '/governance' + (allVersions ? '?allVersions=true' : '');
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

            governanceInfo.value = data.data;
        }
        catch(err) {
            console.error("Error getting IMS governance");
            if(!error.value)
                error.value = err;
        }
    }

    return { governanceInfo: governanceInfo, processCode: 'IMS', error: error, load: load };
}
