import { ref } from 'vue'
import axios from 'axios'

export const revokeRole = function(accessToken, processCode, role, checkinUserId, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    const role_ = role;

    const revoke = async function() {

        try {
            const url = baseUrl + '/role/' + checkinUserId;
            let data = await axios.delete(url, {
                params: {
                    'role': role_
                },
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            response.value = data.data;
        }
        catch(err) {
            error.value = err.message;
            console.error(`Error revoking role ${processCode}.${role} from user ${checkinUserId}`);
        }
    }

    return { response: response, error: error, revoke: revoke };
}
