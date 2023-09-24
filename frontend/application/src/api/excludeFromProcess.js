import { ref } from 'vue'
import axios from 'axios'

export const excludeFromProcess = function(accessToken, processCode, checkinUserId, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const exclude = async function() {

        try {
            const url = baseUrl + '/process/' + checkinUserId;
            let data = await axios.delete(url, {
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
            console.error(`Error excluding user ${checkinUserId} from process ${processCode}`);
        }
    }

    return { response: response, error: error, exclude: exclude };
}
