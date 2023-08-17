import { ref } from 'vue'
import axios from 'axios'

export const getUsersWithRole = function(accessToken, processCode, role, baseUrl) {
    const users = ref(null);
    const error = ref(null);

    const load = async function() {

        try {
            const url = baseUrl + '/users/roles' + (role ? `?role=${role}` : '');
            let data = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}` }
            });
            if(!data.status) {
                console.log(data.statusText);
                throw Error("Error in request " + url + " : " + data.status);
            }

            users.value = data.data;
        }
        catch(err) {
            error.value = err.message;
            console.log("Error getting " + processCode + " users" + (role ? ` with role ${role}` : ""));
        }
    }

    return { page: users, error: error, load: load };
}
