/* eslint-disable no-unused-vars */
import * as types from './mutation-types'
import {playMode} from '../assets/js/config'
import {shuffle} from '../assets/js/util'
import {saveSearch, deleteSearch, clearSearch} from '../assets/js/cache'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if(state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST,randomList)
        index = findIndex(randomList, list[index])
    }else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    //记录当前歌曲
    let currentSong = playList[currentIndex]
    let fIndex = findIndex(playList, song)
    currentIndex++
    playList.splice(currentIndex, 0, song)
    if(fIndex > -1) {
        if(currentIndex > fIndex) {
            playList.splice(fIndex, 1)
            currentIndex--
        }else {
            playList.splice(fIndex + 1, 1)
        }
    }

    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    let fSIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)
    if(fSIndex > -1) {
        if(currentSIndex > fSIndex) {
            sequenceList.splice(fSIndex, 1)
        }else {
            sequenceList.splice(fSIndex + 1, 1)
        }
    }

    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCHHISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCHHISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
    commit(types.SET_SEARCHHISTORY, clearSearch())
}