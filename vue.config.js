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
            })
        }
    }
}