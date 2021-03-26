const baseSeverURL = "http://localhost"
const serverPort = ":8000"
const openWeatherAPIKey = "2d39eb838f771003b25db8e0d8ed2308";

let generateButton;
let zipCodeInput;
let feelingTextArea;
let dateValue;
let tempValue;
let contentValue;

/*
PostData(`${baseSeverURL}${serverPort}/postData`,{test: "Hello World"}).then( data =>{

  console.log(`This is the returned data from the PostData function: ${JSON.stringify(data)}`)
  GetData(`${baseSeverURL}${serverPort}/getData`).then(data =>{
    console.log(`This is the returned data from the GetData function: ${JSON.stringify(data)}`)
  })

})

GetWeather("2359","AU");*/

function Start(){

  InitElements();
  GetData(`${baseSeverURL}${serverPort}/getData`).then(data =>{
    UpdateUI(data);
  });
}

function Generate(){
  if(!ValidateInput()){
    console.log("Input is not valid");
    return;
  }
  else{
    GetWeather(zipCodeInput.value,"AU").then((res) => {
      const _temp = res.main.temp;
      const _date = GetTodaysDate()

      PostData(`${baseSeverURL}${serverPort}/postData`,{
        temp: _temp,
        date: _date,
        zipCode: zipCodeInput.value,
        feelings: feelingTextArea.value
      }).then((res =>{
        GetData(`${baseSeverURL}${serverPort}/getData`).then(data =>{
          UpdateUI(data);
        });
      }));
    });
  }
}

function UpdateUI(_data){

  if(_data.length === 0)return;

  var latestEntry = _data[_data.length-1];
  dateValue.innerText = latestEntry.date;
  tempValue.innerText = latestEntry.temp;
  contentValue.innerText = `Your Zipcode is ${latestEntry.zipCode} and you are feeling ${latestEntry.feelings}`;
}

function InitElements(){
  generateButton = document.getElementById("generate");
  zipCodeInput = document.getElementById("zip");
  feelingTextArea = document.getElementById("feelings");
  dateValue = document.getElementById("date");
  tempValue = document.getElementById("temp");
  contentValue= document.getElementById("content");

  generateButton.addEventListener("click",Generate);
}

function ValidateInput(){
    if(zipCodeInput.value.length != 4 || isNaN(zipCodeInput.value) ){
      alert("The ZipCode is invalid! Has to be four numbers");
      return false;
    }
    else if(feelingTextArea.value.length === 0){
      alert("You have no feelings, are you ok?")
      return false;
    }

  return true;
}

function UpdateEntry(date,temp,content){
  dateValue.innerText = date;
  tempValue.innerText = temp;
  contentValue.innerText = content;
}

function GetTodaysDate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
}

async function GetWeather(zipCode,countryCode){
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${openWeatherAPIKey}&units=metric`

  const response = await fetch(url);

  try{
    const weather = await response.json();
    console.log(`GET was successful: ${JSON.stringify(weather)}`);
    return weather;
  }catch(error){
    console.log("error",error);
  }
}

/* Client Get and Post Function */

async function GetData(url){
  console.log(`Getting

  From: ${url}`);

  const response = await fetch(url,{
    method: 'GET',
    credentials: 'same-origin',
    headers:{
      'Content-Type': 'application/json',
    },
  });

  try{
    const newData = await response.json();
    console.log(`GET was successful: ${JSON.stringify(newData)}`);
    return newData;
  }catch(error){
    console.log("error",error);
  }
}

async function PostData(url,data){
  console.log(`Posting
  
  Data: ${JSON.stringify(data)}
  To: ${url}`);

  const response = await fetch(url,{
    method: 'POST',
    credentials: 'same-origin',
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try{
    const newData = await response.json();
    console.log(`POST was successful: ${JSON.stringify(newData)}`);
    return newData;
  }catch(error){
    console.log("error",error);
  }
}