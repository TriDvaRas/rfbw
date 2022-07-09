import axios from 'axios';

export default function fetcher(url: string) { return axios.get(url).then(x => x.data) }