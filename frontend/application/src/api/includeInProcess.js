import { ref } from 'vue'
import axios from 'axios'

export const includeInProcess = function(accessToken, processCode, checkinUserId, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const include = async function() {

        try {
            const url = baseUrl + '/process/' + checkinUserId;
            let data = await axios.post(url, {},{
                headers: {
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
            console.error(`Error including user ${checkinUserId} in process ${processCode}`);
        }
    }

    return { response: response, error: error, include: include };
}
