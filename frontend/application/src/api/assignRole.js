import { ref } from 'vue'
import axios from 'axios'

export const assignRole = function(accessToken, processCode, role, roleHolder, handover, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    const role_ = 'symbol' === typeof role ? role.description : role;

    const assign = async function() {

        try {
            const url = baseUrl + '/role/' + roleHolder?.checkinUserId;
            let data = await axios.post(url, {
                    role: role_,
                    roleHolder: roleHolder,
                    handover: handover
                },
                {
                headers: {
                    "Content-Type": 'application/json',
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

            response.value = data.data;
        }
        catch(err) {
            console.error(`Error assigning role ${processCode}.${role_} to user ${roleHolder?.fullName}`);
        }
    }

    return { response: response, processCode: processCode, error: error, assign: assign };
}
