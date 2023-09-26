import { ref } from 'vue'
import axios from 'axios'
import { isValid } from "@/utils";

export const getUsers = function(accessToken, processCode, processOnly, baseUrl) {
    const users = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + `/users?onlyProcess=${processOnly}`;
            let data = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if(!data.status) {
                console.error(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            users.value = data.data;
        }
        catch(err) {
            error.value = err.message;
            console.error("Error getting " + (isValid(processCode) ? processCode : 'VO') + " users");
        }
    }

    return { page: users, processCode: processCode, error: error, load: load };
}
