import { ref } from 'vue'
import axios from 'axios'
import { isValid } from "@/utils";

export const getRoleLogs = function(accessToken, processCode, role, from, limit, baseUrl) {
    const logs = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + `/role/logs?role=${role}&from=${from}&limit=${isValid(limit) ? limit : 25}`;
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

            logs.value = data.data;
        }
        catch(err) {
            console.error(`Error getting assignment logs for role ${processCode}.${role}`);
        }
    }

    return { page: logs, processCode: processCode, error: error, load: load };
}
