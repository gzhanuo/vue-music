import jsonp from '../assets/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    });
    return jsonp(url, data, options);
}

export function getDiscList() {
    const url = '/api/getDiscList'
    const data = Object.assign({}, commonParams, {
        picmid: 1,
        rnd: Math.random(),
        hostUin: 0,
        loginUin: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        sortId: 5,
        categoryId: 10000000,
        sin: 0,
        ein: 19,
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getSongList(disstid) {
    const url = '/api/getSongList'
    const data = Object.assign({}, commonParams, {
        disstid,
        json: 1,
        type: 1,
        utf8: 1,
        onlysong: 0,
        new_format: 1,
        hostUin: 0,
        loginUin: 0,
        format: 'json',
        inCharset: 'utf8',
        needNewCode: 0,
        platform: 'yqq.json'
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}