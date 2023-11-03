import { ref } from 'vue'
import axios from 'axios'


export const getResponsibility = function(accessToken, processCode, allVersions, baseUrl) {
    const responsibilityInfo = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + '/responsibilities' + (allVersions ? '?allVersions=true' : '');
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
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            responsibilityInfo.value = data.data;
        }
        catch(err) {
            console.error("Error getting " + processCode + " responsibilities");
        }
    }

    return { responsibilityInfo: responsibilityInfo, processCode: processCode, error: error, load: load };
}
