import {playMode} from '../assets/js/config'
import {loadSearch} from '../assets/js/cache'

const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    searchHistory: loadSearch()
}

export default state