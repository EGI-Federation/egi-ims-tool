import { ref } from 'vue'
import axios from 'axios'


export const uploadImage = function(accessToken, imageFile, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const upload = async function() {

        try {
            let formData = new FormData();
            formData.append('imageFile', imageFile);

            const url = baseUrl + '/images';
            let data = await axios.post(url, formData,{
                headers: {
                    "Content-Type": 'multipart/form-data',
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
            console.error("Error uploading image");
            if(!error.value)
                error.value = err;
        }
    }

    return { response: response, error: error, upload: upload };
}
