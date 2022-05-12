import axios from "axios";
import { API_HOST_PREFIX } from "./serviceHelpers";
const url = `${API_HOST_PREFIX}/api/polls`;

const add = (payload) => {
  const config = {
    method: 'POST',
    url: `${url}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    header: { 'Content-Type': 'application/json' },
  };
  return axios(config).then((response)=> {
    return {response, ...payload};
  });
};

const getPollMethods = () => {
  const config = {
    method: "POST",
    url: `${API_HOST_PREFIX}/api/lookups`,
    data: ["PollMethodTypes"],
    crossdomain: true,
    withCredentials: true,
    header: { 'Content-Type': 'application/json' }
  };
  return axios(config);
};

const getPollsters = () => {
  const config = {
    method: "POST",
    url: `${API_HOST_PREFIX}/api/lookups`,
    data: ["Pollsters"],
    crossdomain: true,
    withCredentials: true,
    header: { 'Content-Type': 'application/json' }
  };
  return axios(config);
};

const listAll = (pageIndex, pageSize) => {
    const config = {
    method: 'GET',
    url: `${url}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    header: { 'Content-Type': 'application/json' },
  };
  return axios(config).then((response) => {
    return response;
  });
};

const listByQuery = (query, pageIndex, pageSize) => {
  const config = {
    method: 'GET',
    url: `${url}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
        crossdomain: true,
    withCredentials: true,
    header: { 'Content-Type': 'application/json' },
    };
  return axios(config).then((response) => {
    return response;
  });
};

const update = (id, payload) => {
  const config = {
    method: 'PUT',
    url: `${url}/${id}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    header: { 'Content-Type': 'application/json' },
  };
  return axios(config).then((response)=> {
    return {response, payload};
  });
};

const deleteById = (id) => {
  const config = {
    method: 'DELETE',
    url: `${url}/${id}`,
    crossdomain: true,
    withCredentials: true,
    header: { 'Content-Type': 'application/json' },
  };
  return axios(config).then((response) => {
    return {response, id};
  });
};

export { add, listAll, listByQuery, getPollMethods, getPollsters, update, deleteById };
