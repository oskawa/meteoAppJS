/* Retrieve api key from OpenWeatherMap   */
const API_KEY = '90f536d7434ffad3cbaafe71c43541a8'


/* Creation of Array to store favourites places */
const storageCity=new cityStorage("cities")
const cities = storageCity.list


/*--------------------
Retrive hours and days to class elements
--------------------*/
var date = new Date()
var week = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi")
var day = date.getDay()
var h = date.getHours()

/*--------------------
Retrieve id and class from html
--------------------*/

var city = document.querySelector('#city')
var cityTemp = document.querySelector('#cityTemp')
var cityWeather = document.querySelector('#cityWeather')
var imgContainer = document.querySelector('#img-container')
var weekContainer = document.querySelector('.week-container')
var hourContainer = document.querySelector('.hour-container')
var add = document.querySelector('.button-location')
var menu = document.querySelector('#menu')


/*--------------------
Principal function to fetch weather, temp, day, hour, description
--------------------*/

let apiCall = function(city)
{
    weekContainer.innerHTML=""
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`
    fetch(url).then((response) =>
    response.json().then((data) => {

        document.querySelector('#city').innerHTML = data.name
        cityTemp.innerHTML = data.main.temp + '°'
        cityWeather.innerHTML = data.weather[0].description


        /* Retrieve first number of id for weather
        For Example : 2 => Thunderstorm, 3=> Drizzle...
         */
        let ider = data.weather[0].id
        var res = String(ider)
        var result = res.charAt(0)

        /*--------------------
Change image if [description]
--------------------*/
        if (result === '2'/*Thunderstorm*/){
imgContainer.style.backgroundImage = "url('img/Thunderstorm.jpg')"

}else if (result === '3' /*Drizzle*/){
    imgContainer.style.backgroundImage = ""
}else if (result === '5' /*Rain*/){
    imgContainer.style.backgroundImage = "url('img/Rain.jpg')"
}else if (result === '6' /*Snow*/){
    imgContainer.style.backgroundImage = "url('img/snow.jpg')"
}else if (result === '7' /*Atmosphere*/){
    imgContainer.style.backgroundImage = ""
}else if (result === '8' /*Sun*/){
    imgContainer.style.backgroundImage = "url('img/sun.jpg')"
}

    /*--------------------
   Because "onecall" api doesn't require city but lat & lon, I need to retrieve the long & lat of the city from the first API ('data')
   This "onecall" api shows the weather for 5 days

   --------------------*/

        let lat = data.coord.lat
        let lon = data.coord.lon
        let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&cnt=3&appid=${API_KEY}`
        fetch(url2).then((response) =>
            response.json().then((data2) => {
            for (let i = 1; i < 6; i++) {
    var tempDay = data2.daily[0+i].feels_like.day
    var imgDay = data2.daily[0+i].weather[0].icon

    day +=1
    var ecrit = week[day]
    if (day == week.length-1){
        day = -1
    }
    weekContainer.innerHTML += '<div class = "day-info"><p id="futureDay">' + ecrit + '</p><p id="futureTemp">'+ tempDay +'°</p><img src="http://openweathermap.org/img/wn/'+imgDay+'.png"></div>'
            }
    for (let i = 0; i < 5; i++) {
        h +=1
        if (h == 24){
            h = 00
        }
        resp = data2.hourly[i].temp


        hourContainer.innerHTML += '<div class="hour"><p>'+h+'h</p><p>'+resp+'°</p><img src="http://openweathermap.org/img/wn/'+imgDay+'.png">'

    }
            }
))
}))
}





/*--------------------
Dynamic change of the page when someone put city in the input field
--------------------*/
document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault()
    let ville = document.querySelector('#input').value
    apiCall(ville)
})





apiCall('Paris')


/*--------------------
Using jquery & owlCarousel for the carousel
--------------------*/

var sync1 = $("#img-container");

sync1.owlCarousel({
    items : 1,
    slideSpeed : 2000,
    nav: false,
    autoplay: false,
    dots: false,
    loop: false,
    responsiveRefreshRate : 200,
    navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>','<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],
}).on('changed.owl.carousel', syncPosition);

function syncPosition(el) {
    //if you set loop to false, you have to restore this next line
    var current = el.item.index;
}

/*--------------------
Function to add city in the menu
--------------------*/

function cityToDOM(city) {
    if (typeof city === 'string' && city) {
        const li = document.createElement('li')
        const a = document.createElement('a')
        const remove = document.createElement('button')
        a.textContent = city
        remove.textContent = 'Remove'

        remove.addEventListener('click', () => {
            const value = remove.parentNode.firstChild.textContent

            storageCity.remove(value)
            menu.removeChild(remove.parentNode)
        })
        li.addEventListener('click', ()=>{

            apiCall(a.innerHTML)
            menu.className = "menuOff";
        })
        li.appendChild(a)
        li.appendChild(remove)
        menu.appendChild(li)
        return true
    }
    return false
}
/*--------------------
Shows the city in the menu
--------------------*/

cities.forEach(city => cityToDOM(city))

/*--------------------
Add the city in the storage Array
--------------------*/

function newCity(){
    if(storageCity.list.indexOf(city.innerHTML) === -1 && cityToDOM(city.innerHTML)){
        storageCity.set(city.innerHTML)
    }
}

add.addEventListener('click', newCity)

/*--------------------
Off / On menu
--------------------*/

function buttonclick()
{

    if (menu.className == "menuOff")
    {

        menu.className = "menuOn";
    } else
    {

        menu.className = "menuOff";
    }
}

