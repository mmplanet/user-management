import Config from './config.js';
import fetchWrapper from './fetchWrapper';

export const apiFetchUser = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/users/' + args.userId;
    return fetchWrapper.get(endpoint, args.token, {})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't fetchUser from endpoint");
            }
        })
        .catch((error) => {
            console.log('fetchUser ' + error.toString());
        });
}

export const apiFetchUsers = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/users';
    return fetchWrapper.get(endpoint, args.token, {})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't fetchUsers from endpoint");
            }
        })
        .catch((error) => {
            console.log('fetchUsers ' + error.toString());
        });
}

export const apiUpdateUser = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/users/' + args.userId;
    return fetchWrapper.put(endpoint, args.token, {body: args.userData})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't fetchUser from endpoint");
            }
        })
        .catch((error) => {
            console.log('fetchUser ' + error.toString());
        });
}

export const apiDeleteUser = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/users/' + args.userId;
    return fetchWrapper.delete(endpoint, args.token)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't deleteUser from endpoint");
            }
        })
        .catch((error) => {
            console.log('deleteUser ' + error.toString());
        });
}

export const apiAddUser = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/users';
    return fetchWrapper.post(endpoint, args.token, {body: args.user})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't addUser from endpoint");
            }
        })
        .catch((error) => {
            console.log('addUser ' + error.toString());
        });
}

export const apiAddUserToGroup = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/users/' + args.userId + '/add-to-group?groupId=' + args.groupId;
    return fetchWrapper.post(endpoint, args.token)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't addUserToGroup from endpoint");
            }
        })
        .catch((error) => {
            console.log('addUserToGroup ' + error.toString());
        });
}

export const apiRemoveUserFromGroup = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/users/' + args.userId + '/remove-from-group?groupId=' + args.groupId;
    return fetchWrapper.post(endpoint, args.token)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't removeUserFromGroup from endpoint");
            }
        })
        .catch((error) => {
            console.log('removeUserFromGroup ' + error.toString());
        });
}

export const apiAddGroup = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/groups';
    return fetchWrapper.post(endpoint, args.token, {body: args.group})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't addGroup from endpoint");
            }
        })
        .catch((error) => {
            console.log('addGroup ' + error.toString());
        });
}

export const apiFetchGroups = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/groups';
    if (args.userId !== undefined && args.userId !== null) {
        endpoint = endpoint + '?userId=' + args.userId;
    }

    return fetchWrapper.get(endpoint, args.token, {})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't fetchGroups from endpoint");
            }
        })
        .catch((error) => {
            console.log('fetchGroups ' + error.toString());
        });
}

export const apiDeleteGroup = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/admin/groups/' + args.groupId;
    return fetchWrapper.delete(endpoint, args.token)
        .then((response) => response)
        .catch((error) => {
            console.log('deleteGroup ' + error.toString());
        });
}

export const apiLoginUser = (email, password) => {
    let endpoint = Config.baseAPIEndpoint + '/login';
    const options = {};
    options.body = {email, password};
    return fetchWrapper.post(endpoint, null, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't login user");
            }
        })
        .catch((error) => {
            console.log('loginUser ' + error.toString());
        });
}

export const apiRegisterUser = (email, password, firstName, lastName) => {
    let endpoint = Config.baseAPIEndpoint + '/register';
    const options = {};
    options.body = {email, password, firstName, lastName};
    return fetchWrapper.post(endpoint, null, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't register user");
            }
        })
        .catch((error) => {
            console.log('registerUseer ' + error.toString());
        });
}

export const apiFetchProfile = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/profiles/' + args.slug;
    return fetchWrapper.get(endpoint, args.token, {})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't fetchProfile from endpoint");
            }
        })
        .catch((error) => {
            console.log('fetchProfile ' + error.toString());
        });
}

export const apiFetchOwnProfiles = (args) => {
    let endpoint = Config.baseAPIEndpoint + '/profiles/self';
    return fetchWrapper.get(endpoint, args.token, {})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson !== null) {
                if (responseJson.error !== null) {
                    return responseJson;
                } else {
                    return null;
                }
            } else {
                console.warn("Couldn't fetchOwnProfiles from endpoint");
            }
        })
        .catch((error) => {
            console.log('fetchOwnProfiles ' + error.toString());
        });
}
