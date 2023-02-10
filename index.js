const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup" , e => {
    // if user pressed Enter button and input field is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click" , ()=>{
    if(navigator.geolocation){      // if browser supports geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess , onError);
    }else{
        alert("Your browser does not support geolocation api");
    }
});

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function onSuccess(position){
    const {latitude , longitude} = position.coords; // getting latitude and longitude of user's device from coord obj in api result.
    api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=859d8588158dac4003107ff689ce1428`;
    fetchData();
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=859d8588158dac4003107ff689ce1428`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting api request and returning it with parsing into js obj and in another 
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending" , "error");
        infoTxt.innerText = `"${inputField.value}" is not a valid City name`;
    }
    else{
        // get the required properties values from the info object.
        const city = info.name;
        const country = info.sys.country;
        const {description ,id} = info.weather[0];
        const {feels_like , humidity , temp} = info.main;

        // Set images based on the weather id from api.
        if(id == 800){
            wIcon.src = "Weather Icons/clear.svg";
            document.body.style.backgroundImage = "url('Weather Images/clear sky.jpg')";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "Weather Icons/storm.svg";
            document.body.style.backgroundImage = "url('Weather Images/Storm Weather.jpg')";
        }else if(id >= 600 && id <= 622){
            wIcon.src = "Weather Icons/snow.svg";
            document.body.style.backgroundImage = "url('Weather Images/Snow Weather.jpg')";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "Weather Icons/haze.svg";
            document.body.style.backgroundImage = "url('Weather Images/Haze Weather.jpg')";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "Weather Icons/cloud.svg";
            document.body.style.backgroundImage = "url('Weather Images/Cloudy Sun.jpg')";
        }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "Weather Icons/rain.svg";
            document.body.style.backgroundImage = "url('Weather Images/Rainy Weather.jpg')";
        }

        // pass these values to a particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity} %`;
    

        infoTxt.classList.remove("pending" , "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click" , ()=>{
    wrapper.classList.remove("active");

});
