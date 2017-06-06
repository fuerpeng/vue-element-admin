import fetch from 'utils/fetch';
import axios from 'axios';
export function fetchList(query) {
  return fetch({
    url: '/article_table/list',
    method: 'get',
    params: query
  });
}

export function fetchPv(pv) {
  return fetch({
    url: '/article_table/pv',
    method: 'get',
    params: { pv }
  });
}

export function getCity() {
  return axios.get('/v1/cities')
}
