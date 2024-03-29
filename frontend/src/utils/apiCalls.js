import axios from 'axios';

export default {
    get(url, payload) {
        if (payload)
            return axios.get(url, {
                params: {
                    source_content_type: 'application/json',
                    source: JSON.stringify(payload.query)
                }
            });
        return axios.get(url);
    },
    post(url, payload = {}) {
        return axios.post(url, payload.body);
    },
    put(url, payload = {}) {
        return axios.put(url, payload.body);
    },
    patch(url, payload = {}) {
        return axios.patch(url, payload.body);
    },
    delete(url) {
        return axios.delete(url);
    }
};
