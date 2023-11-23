import { ref } from 'vue'
import axios from 'axios'

export const includeInProcess = function(accessToken, processCode, user, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const include = async function() {

        try {
            const url = baseUrl + '/process/' + user?.checkinUserId;
            let data = await axios.post(url, user,{
                headers: {
                    'Content-Type': 'application/json',
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
            console.error(`Error including user ${user?.fullName} in process ${processCode}`);
        }
    }

    return { response: response, processCode: processCode, error: error, include: include };
}
