import { ref } from 'vue'
import axios from 'axios'

export const assignRole = function(accessToken, processCode, role, checkinUserId, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    const role_ = 'symbol' === typeof role ? role.description : role;

    const assign = async function() {

        try {
            const url = baseUrl + '/role/' + checkinUserId;
            let data = await axios.post(url, {},{
                params: {
                    'role': role_
                },
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
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
            console.error(`Error assigning role ${processCode}.${role_} to user ${checkinUserId}`);
        }
    }

    return { response: response, error: error, assign: assign };
}
