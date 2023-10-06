import { ref } from 'vue'
import axios from 'axios'

export const getRoles = function(accessToken, processCode, role, baseUrl) {
    const roles = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + "/role/definitions" + (role ? `?role=${role}` : '');
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

            roles.value = data.data;
        }
        catch(err) {
            console.error(`Error getting ${role ? processCode + '.' + role : processCode} role definition${role ? '' : 's'}`);
        }
    }

    return { page: roles, processCode: processCode, error: error, load: load };
}
