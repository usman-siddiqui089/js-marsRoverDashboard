let store = Immutable.Map({
    roverImages: ''
})

// add our markup to the page
const textWrapper = document.getElementById('welcome-text')
const homeContent = document.getElementById('home-content')
const windSpan = document.getElementById('wind-speed')
const tempSpan = document.getElementById('temperature')
const curiosityContent = document.getElementById('curiosity-content')
const opportunityContent = document.getElementById('opportunity-content')
const spiritContent = document.getElementById('spirit-content')

function roverClick(rover) {
    const roverID = rover.id
    getRoverImagesApiData(roverID)
}

const getRoverImagesApiData = (rover) => {
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json())
    .then(data => {
        const newState = updateStore(data)
        retrieveImagesAndData(newState)
    })
}

function retrieveImagesAndData(state){
    const latestPhotosArr = Array.from(state.get('roverImages').get('latest_photos'))
    const imgSrcArr = Array.from(Immutable.Seq(latestPhotosArr).map(rover => rover.toObject().img_src))
    const roverInfo = latestPhotosArr[0].toObject().rover.toObject()
    const final_data = {
        imgSrcArr,
        roverInfo
    }
    setContent(final_data.roverInfo.name, generateHtml(final_data))
}

function setContent(roverName,htmlData){
    switch(roverName) {
        case 'Curiosity':
            curiosityContent.innerHTML = htmlData
            break;
        case 'Opportunity':
            opportunityContent.innerHTML = htmlData
            break;
        case 'Spirit':
            spiritContent.innerHTML = htmlData
            break;
        default:
            return false;
    }
}

function generateHtml(roverObj){
    return `                                                
        <div class="tm-img-gallery-info-container">                                    
            <h2 class="tm-text-title tm-gallery-title"><span class="tm-bold tm-yellow" id="roverName">${roverObj.roverInfo.name}</span></h2>
            <p class="tm-text"><span class="tm-yellow roverInfoTitle">Launch Date:</span><span class="tm-white roverInfoData" id="roverLaunchDate">&nbsp;${roverObj.roverInfo.launch_date}</span></p>
            <p class="tm-text"><span class="tm-yellow roverInfoTitle">Landing Date:</span><span class="tm-white roverInfoData" id="roverLandingDate">&nbsp;${roverObj.roverInfo.landing_date}</span></p>
            <p class="tm-text"><span class="tm-yellow roverInfoTitle">Status:</span><span class="tm-white roverInfoData" id="roverStatus">&nbsp;${roverObj.roverInfo.status}</span></p>
        </div>      
        ${generateImageTiles(roverObj.imgSrcArr)}                                                                  
    `
}

function generateImageTiles(imagesArr){
    let imageGallery = ''
    for(let i=0; i<imagesArr.length; i++){
        imageGallery += `
            <div class="grid-item">
                <img src="${imagesArr[i]}" alt="Image" class="img-fluid tm-img">
            </div>
        `
    }
    return imageGallery
}

const updateStore = (newState) => {
    const newStore = store.merge(store,newState)
    return newStore
}

const render = async () => {
    return App()
}

const App = () => {
    homeContent.style.display = 'block';
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    setTimeout(function(){
        render(store)
        getWeatherApiData()
    },3500)
})

// Retrieve Weather Api Data and Display
const getWeatherApiData = () => {
    fetch(`http://localhost:3000/weather`)
    .then(res => res.json())
    .then(data => {
        const weatherState = updateStore(data)
        retrieveWeatherInfo(weatherState)
    })
}

function retrieveWeatherInfo(state){
    const weatherObj = state.get('weather')
    const sol_key = weatherObj.get('sol_keys').get(0)
    const temperature = weatherObj.get(sol_key).get('AT').get('av')
    const windSpeed = weatherObj.get(sol_key).get('HWS').get('av')
    generateWeatherHtml(temperature,windSpeed)
}

function generateWeatherHtml(temp,ws){
    windSpan.innerHTML = `<span>${ws} m/s</span>`
    tempSpan.innerHTML = `<span>${temp}&deg; F</span>`
}

// Preloader Animations Here
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
anime.timeline({loop: false})
  .add({
    targets: '.welcome-text .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.welcome-text',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });