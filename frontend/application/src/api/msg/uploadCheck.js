import { ref } from 'vue'
import axios from 'axios'


export const uploadCheck = function(accessToken, fileName, fileSize, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const check = async function() {

        try {
            const url = baseUrl + '/images/check';
            let data = await axios.post(url, {
                name: fileName,
                size: fileSize
            },{
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
            console.error("Error checking if image file exists");
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, error: error, check: check };
}
