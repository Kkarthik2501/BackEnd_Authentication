var express = require('express')
var cors = require('cors')

var mongoose = require('mongoose')
var app = express()
const port = 7930
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
app.use(express.json())
app.use(cors())
var url = 'mongodb://localhost:27017/NetflixDB'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Mongodb Connection established")
})
    .catch((error) => {
        console.log("Mongodb connection failed", error)
    })

const userdetails = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, unique: true, minlength: 8 },
    // name: { type: String }
})


const UserSchema = mongoose.model('UserSchema', userdetails)


const generateAccessToken = (email) => {

    const token = jwt.sign({ email: email }, 'secret', { expiresIn: 5 })

    return token

}

app.post('/register', async (req, res) => {
    console.log("Called")
    const password = req.body.password
    const email = req.body.email
    //schema.pre() method to create middleware
    if (!email || !password) {
        return res.status(400).json({ message: "Fields missing" })
    }
    console.log(token)
    console.log(req.body)
    try {
        bcrypt.hash(password, 12, async function (err, hash) {
            UserSchema.create({ email, password, password: hash }).then((user) => {
                res.statusCode = 200
                // res.statusMessage = "Done"
                console.log("200")
                console.log(user)
                res.status(200).json({ data: { user: user, token: token }, })
            })
        })

    }
    catch {
        console.log("enable to create new user")
    }
})

app.post('/signin', async (req, res) => {
    const email = req.body.email
    const password = req.body.password


    if (!email || !password) {
        return res.status(400).json({ message: "Fields missing" })
    }


    const user = await UserSchema.findOne({ email })
    if (!user) {
        return res.status(400).send("Invalid Credentials")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {

        res.status(400).send("Invalid Credentials")
    }
    else {

        return res.status(200).json({ user: user, token: generateAccessToken(email) })
    }

})

app.listen(port, () => { console.log("server started" + port) })