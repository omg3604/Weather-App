const wrapper = document.querySelector(".wrapper");
inputPart = wrapper.querySelector(".input-part");
infoTxt = inputPart.querySelector(".info-txt");
inputField = inputPart.querySelector("input");
locationBtn = inputPart.querySelector("button");

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
    api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=859d8588158dac4003107ff689ce1428`;
    fetchData();
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=859d8588158dac4003107ff689ce1428`;
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
        infoTxt.innerText = `${inputField.value} is not a valid City name`;
    }
    else{
        infoTxt.classList.remove("pending" , "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}
