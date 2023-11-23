import { ref } from 'vue'
import axios from 'axios'


export const implementRole = function(accessToken, processCode, role, changeBy, changeDescription, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    const role_ = 'symbol' === typeof role ? role.description : role;

    const implement = async function() {

        try {
            const url = baseUrl + '/role/definition/' + role_;
            let data = await axios.patch(url,
                {
                    changeBy: changeBy,
                    changeDescription: changeDescription
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
            console.error(`Error implementing role ${processCode}.${role_}`);
        }
    }

    return { response: response, processCode: processCode, error: error, implement: implement };
}
