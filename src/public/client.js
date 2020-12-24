let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')
const textWrapper = document.getElementById('welcome-text')
const homeContent = document.getElementById('home-content')

function roverClick(rover) {
    const roverId = rover.id
    switch (roverId) {
        case 'curiosity':
            getRoverImages(roverId)
            break;
        case 'opportunity':
            getRoverImages(roverId)
            break;
        case 'spirit':
            getRoverImages(roverId)
            break;
        default:
            return false;
    }
}

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    // root.innerHTML = App(state)
    return App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state
    homeContent.style.display = 'block';
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    setTimeout(function(){
        render(root, store)
    },3500)
})

// ------------------------------------------------------  COMPONENTS


// ------------------------------------------------------  API CALLS

// // Example API call
// const getImageOfTheDay = (state) => {
//     let { apod } = state

//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, { apod }))

//     return { apod }
// }

const getWeatherInfo = () => {
    fetch(`http://localhost:3000/weather`)
    .then(res => res.json())
    .then(data => console.log(data.weather))
}

getWeatherInfo();

const getRoverImages = (rover) => {
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json())
    .then(data => console.log(data))
}

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
