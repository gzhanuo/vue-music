var axios = require('axios')

module.exports = {
    devServer: {
        before(app) {
            app.get("/api/getDiscList", function(req, res) {
                var url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg"
                axios.get(url, {
                    headers: {
                        referer: 'https://y.qq.com/portal/playlist.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }),
            app.get("/api/getSingerList", function(req, res) {
                var url = "https://u.y.qq.com/cgi-bin/musicu.fcg"
                axios.get(url, {
                    headers: {
                        referer: 'https://y.qq.com/portal/singer_list.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }),
            app.get("/api/getSingerDetail", function(req, res) {
                var url = "https://u.y.qq.com/cgi-bin/musicu.fcg"
                axios.get(url, {
                    headers: {
                        referer: 'https://y.qq.com/n/yqq/singer.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }),
            app.get("/api/getplaysongvkey", function(req, res) {
                var url = "https://u.y.qq.com/cgi-bin/musicu.fcg"
                axios.get(url, {
                    headers: {
                        origin: 'https://y.qq.com',
                        referer: 'https://y.qq.com/portal/player.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }),
            app.get("/api/lyric", function(req, res) {
                var url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"
                axios.get(url, {
                    headers: {
                        origin: 'https://y.qq.com',
                        referer: 'https://y.qq.com/portal/player.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }),
            app.get("/api/gethotkey", function(req, res) {
                const url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg"
                axios.get(url, {
                    headers: {
                        origin: 'https://y.qq.com',
                        referer: 'https://y.qq.com/m/index.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }),
            app.get('/api/search', function(req, res) {
                const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
                axios.get(url, {
                    headers: {
                        origin: 'https://y.qq.com',
                        referer: 'https://y.qq.com/m/index.html?tab=recommend'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }),
            app.get('/api/getSongList', function(req, res) {
                const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
                axios.get(url, {
                    headers: {
                        origin: 'https://y.qq.com',
                        referer: 'https://y.qq.com/n/yqq/playlist.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            })
        }
    }
}