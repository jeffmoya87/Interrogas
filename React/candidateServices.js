import axios from 'axios';
import { API_HOST_PREFIX } from './serviceHelpers';

const endpoint = 'api/candidates';
const url = `${API_HOST_PREFIX}/${endpoint}`;

const getCandidates = () => {
    const config = {
        method: 'GET',
        url: `${url}/paginate?pageIndex=0&pageSize=50`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

const getAllCandidates = () => {
    const config = {
        method: 'GET',
        url: url,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const getCandidateById = (id) => {
    const config = {
        method: 'GET',
        url: `${url}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

const deleteCandidate = (id) => {
    const config = {
        method: 'DELETE',
        url: `${url}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const addCandidate = (payload) => {
    const config = {
        method: 'POST',
        url: `${url}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

const updateCandidate = (id, payload) => {
    const config = {
        method: 'PUT',
        url: `${url}/${id}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

export { getAllCandidates, getCandidates, deleteCandidate, addCandidate, updateCandidate, getCandidateById }; // export all your calls here
