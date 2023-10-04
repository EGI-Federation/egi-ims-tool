import { ref } from 'vue'
import axios from 'axios'


export const implementRole = function(accessToken, processCode, role, user, message, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    const role_ = 'symbol' === typeof role ? role.description : role;

    const implement = async function() {

        try {
            const url = baseUrl + '/role/definition/' + role_;
            let data = await axios.patch(url,
                {
                    changeBy: user,
                    changeDescription: message
                },
                {
                    headers: {
                        "Content-Type": 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            ).catch(function(e) {
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
            console.error(`Error implementing role ${processCode}.${role_}`);
        }
    }

    return { response: response, error: error, implement: implement };
}
