import { ref } from 'vue'
import axios from 'axios'
import { deepClone } from "@/utils";


export const addRole = function(accessToken, processCode, roleInfo, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const add = async function() {

        try {
            const url = baseUrl + "/role/definition";
            let data = await axios.post(url, roleInfo,{
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
            console.error(`Error adding role ${processCode}.${roleInfo.role}`);
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, processCode: processCode, error: error, add: add };
}
