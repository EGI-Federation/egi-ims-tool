import { ref } from 'vue'
import axios from 'axios'

export const revokeRole = function(accessToken, processCode, role, roleHolder, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    const role_ = role;

    const revoke = async function() {

        try {
            const url = baseUrl + '/role/' + roleHolder?.checkinUserId;
            let data = await axios.delete(url, {
                data: {
                    role: role_,
                    roleHolder: roleHolder
                },
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
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            response.value = data.data;
        }
        catch(err) {
            console.error(`Error revoking role ${processCode}.${role} from user ${roleHolder?.fullName}`);
        }
    }

    return { response: response, processCode: processCode, error: error, revoke: revoke };
}
