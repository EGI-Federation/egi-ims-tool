import { ref } from 'vue'
import axios from 'axios'

export const excludeFromProcess = function(accessToken, processCode, user, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const exclude = async function() {

        try {
            const url = baseUrl + '/process/' + user?.checkinUserId;
            let data = await axios.delete(url, {
                data: user,
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
            console.error(`Error excluding user ${user?.fullName} from process ${processCode}`);
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, processCode: processCode, error: error, exclude: exclude };
}
