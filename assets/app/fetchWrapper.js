import Cookies from 'js-cookie';

function fetchWrapper() {
    return {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE'),
    };

    function request(method) {
        return (url, token, options) => {
            const requestOptions = {
                method,
                headers: {
                    Accept: 'application/json',
                    ...authHeader(token),
                    ...options?.headers ? options.headers : {},
                },
            };
            if (options?.body) {
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(options.body);
            }

            return fetch(url, requestOptions).then((response) => handleResponse(response));
        };
    }

    // helper functions

    function authHeader(token) {
        const isLoggedIn = !!token;
        if (isLoggedIn) {
            return {'Authorization': `Bearer ${token}`};
        } else {
            return {};
        }
    }

    function handleResponse(response) {
        if (!response.ok) {
            if ([401].includes(response.status)) {
                Cookies.remove('token');
                window.location.reload(false);
            }
        }

        return response;
    }
}

export default fetchWrapper();
