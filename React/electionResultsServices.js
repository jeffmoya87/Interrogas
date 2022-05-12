import axios from 'axios';
import './serviceHelpers';
import { API_HOST_PREFIX } from './serviceHelpers';

const endpoint = `${API_HOST_PREFIX}/api/elections/results`;

const getElectionResultsById = (id) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const getElectionResultsSearch = (pageIndex, pageSize, query) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const electionResultsServices = { getElectionResultsById, getElectionResultsSearch };

export default electionResultsServices;
