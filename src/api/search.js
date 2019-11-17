/* eslint-disable no-console */
import {commonParams} from './config'
import axios from 'axios'

export function gethotkey() {
    const url = '/api/gethotkey'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        format: 'json',
        needNewCode: 1,
        uin: 0
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)  
    })
}

export function search(query, page, zhida, perpage) {
    const url = '/api/search'
    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: perpage,
        n: perpage,
        remoteplace: 'txt.mqq.all',
        needNewCode: 1,
        uin: 0,
        platform: 'h5',
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)  
    })
}