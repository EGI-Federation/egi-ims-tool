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
            console.error(`Error deprecating role ${processCode}.${role_}`);
        }
    }

    return { response: response, processCode: processCode, error: error, deprecate: deprecate };
}
