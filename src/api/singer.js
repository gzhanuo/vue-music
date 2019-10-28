import {commonParams} from './config'
import axios from 'axios'
import store from '../store/store'

export function getSingerList() {
    const url = '/api/getSingerList'
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        loginUin: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        format: 'json',
        data: '{"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}'
    })
    
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getSingerDetail() {
    const url = '/api/getSingerDetail'
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUnin: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        format: 'json',
        data: `{"comm":{"ct":24,"cv":0},"singer":{"method":"get_singer_detail_info","param":{"sort":5,"singermid":"${store.state.singer.mid}","sin":0,"num":100},"module":"music.web_singer_info_svr"}}`
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getplaysongvkey(songmid) {
    const url = '/api/getplaysongvkey'
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq.json',
        inChrset: 'utf8',
        needNewCode: 0,
        format: 'json',
        data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"6187608800","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"6187608800","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}`
    })
    
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}