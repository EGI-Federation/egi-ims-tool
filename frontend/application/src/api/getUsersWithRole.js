import { ref } from 'vue'
import axios from 'axios'

export const getUsersWithRole = function(accessToken, processCode, role, baseUrl) {
    const users = ref(null);
    const error = ref(null);
    const role_ = 'symbol' === typeof role ? role.description : role;

    const load = async function() {

        try {
            const url = baseUrl + '/users/roles' + (role ? `?role=${role_}` : '');
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

            users.value = data.data;
        }
        catch(err) {
            console.error(`Error getting users holding ${processCode ? processCode + ' roles' : 'role ' + processCode + '.' + role_}`);
        }
    }

    return { page: users, processCode: processCode, error: error, load: load };
}
