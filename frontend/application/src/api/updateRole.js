import { ref } from 'vue'
import axios from 'axios'
import { deepClone } from "@/utils";


export const updateRole = function(accessToken, processCode, roleInfo, baseUrl) {
    const response = ref(null);
    const error = ref(null);
    let ri = deepClone(roleInfo);
    if('symbol' === typeof ri.role)
        ri.role = ri.role.description;

    const update = async function() {

        try {
            const url = baseUrl + "/role/definition";
            let data = await axios.put(url, ri,{
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
            console.error(`Error updating ${processCode}.${ri.role} role definition`);
        }
    }

    return { response: response, error: error, update: update };
}
