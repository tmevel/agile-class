navigator.mediaDevices.getUserMedia({
    video: true
})
.then(stream => {
    document.getElementById("vid").srcObject = stream;
})

function startTime() {
var today = new Date();
var hours = today.getHours();
var minutes = today.getMinutes();
var seconds = today.getSeconds();

var amPm = "am";
if(hours > 12){
    amPm = "pm";
    hours = hours-12;
}
//Put zeros before numbers < 10
if(minutes < 10){
    minutes = "0" + minutes;
}
if(seconds < 10){
    seconds = "0" + seconds;
}
if(hours < 10){
    hours = "0" + hours;
}

var str1 = new String("Current time");
var str2 = new String("Device");



var time = str1.bold() + ': ' +  hours + ' :  ' + minutes + ' : ' + seconds + '  ' + amPm;


/*display current time*/

document.getElementById("currentTime").innerHTML = time;
//Autorefreshing time every seconds

setTimeout(function(){startTime()}, 1, 1000);

}

let toggle = document.querySelector(".toggle");
let text = document.querySelector(".text");

function Animatedtoggle(){
    toggle.classList.toggle("active");

    if(toggle.classList.contains("active")){
        text.innerHTML = "ON";
    }else{
        text.innerHTML="OFF";
    }
}