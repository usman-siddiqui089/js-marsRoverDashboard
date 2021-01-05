require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API call for weather
app.get('/weather', async (req,res) => {
    try {
        const weather_api = `https://api.nasa.gov/insight_weather/?api_key=${process.env.API_KEY}&feedtype=json&ver=1.0`
        const weather = await fetch(weather_api)
        .then(res => res.json())
        res.send({weather})
    } catch (error) {
        console.log('Error!:',error)
    }
})

const rovers = ['curiosity','spirit','opportunity']
const roversData = ()=>{rovers.forEach((rover)=> {
    app.get(`/${rover}`, async (req,res) => {
        try {
            const roverApi = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
            const roverImages = await fetch(roverApi)
            .then(res => res.json())
            res.send({roverImages})
        } catch (error) {
            console.log('Error!',error)
        }
    })
})}

roversData();
app.listen(port, () => console.log(`Example app listening on localhost://${port}!`))