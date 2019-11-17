import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list) {
        state.playList = list
    },
    // [types.SET_PLAYLIST_URL](state, keyUrl) {
    //     let index = keyUrl.index
    //     let url = keyUrl.url
    //     state.playList[index].url = url
    // },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    [types.SET_SEARCHHISTORY](state, list) {
        state.searchHistory = list
    }
}

export default mutations