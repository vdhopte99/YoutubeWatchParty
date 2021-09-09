const router = require('express').Router()
const axios = require('axios')
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search?maxResults=1&path=snippet&type=video&key=AIzaSyBYHFYP_JZIhOEFszi6j9UyZI2UezLN8ow&q='

// get youtube video
router.get('/', async (req, res) => {
     try {
        const axRes = await axios.get(BASE_URL + req.body.query);
        return res.status(200).json(axRes.data)
    } catch(err) {
        return res.status(500).json(err)
    }
})

module.exports = router