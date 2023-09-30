import { ref } from 'vue'
import axios from 'axios'


export const updateRole = function(accessToken, processCode, roleInfo, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const update = async function() {

        try {
            const url = baseUrl + "/role";
            let data = await axios.put(url, roleInfo,{
                headers: {
                    "Content-Type": 'application/json',
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
            console.error(`Error updating ${processCode}.${roleInfo.role.description} role definition`);
        }
    }

    return { response: response, error: error, update: update };
}
