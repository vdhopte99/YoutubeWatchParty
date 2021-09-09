const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')

const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
})
.then(()=>{
    console.log('Database connected!');
})
.catch((err)=>{
    console.log(err);
})

app.use("/images", express.static(path.join(__dirname, "public/images")))

// routers 
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const roomRoute = require('./routes/rooms')
const messageRoute = require('./routes/messages')
const youtubeRoute = require('./routes/youtube')

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({storage})
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        return res.status(200).json("Successfully uploaded file!")
    } catch(err) {
        console.log(err)
    }
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/rooms', roomRoute)
app.use('/api/messages', messageRoute)
app.use('/api/youtube', youtubeRoute)

app.listen(8800, () => {
    console.log('Backend connected!')
})