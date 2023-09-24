import { ref } from 'vue'
import axios from 'axios'


export const approveProcess = function(accessToken, processCode, approve, notes, user, baseUrl) {
    const response = ref(null);
    const error = ref(null);

    const request = async function() {

        try {
            const url = baseUrl + '/process/approve';
            let data = await axios.patch(url,
                {
                    operation: approve ? 'Approve' : 'Reject',
                    changeDescription: notes,
                    approver: user
                },
                {
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
            console.error("Error requesting " + processCode + " process approval");
        }
    }

    return { response: response, error: error, request: request };
}
