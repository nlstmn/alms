import Constants from './Constants';
import fetch from '../helpers/FetchWithTimeout';
const create = () => {
    const getOrganizations = () => fetch(Constants.OrganizationApi, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => res.json()).then(json => {
        return json
    })

    return {
        getOrganizations,
    }
}

export default {
    create
}