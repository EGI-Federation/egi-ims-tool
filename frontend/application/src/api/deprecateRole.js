import { ref } from 'vue'
import axios from 'axios'


export const deprecateRole = function(accessToken, processCode, role, user, message, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    const role_ = 'symbol' === typeof role ? role.description : role;

    const deprecate = async function() {

        try {
            const url = baseUrl + '/role/definition/' + role_;
            let data = await axios.delete(url, {
                headers: {
                    "Content-Type": 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                data: {
                    changeBy: user,
                    changeDescription: message,
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
            console.error(`Error deprecating role ${processCode}.${role_}`);
        }
    }

    return { response: response, error: error, deprecate: deprecate };
}