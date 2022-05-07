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

var toggle;
var text;
//var host = "195.14.189.82";
var host = "localhost";

window.onload = function () {
    toggle = document.querySelector("#toggle");
    text = document.querySelector("#status");

    $.get("http://" + host + ":3000/api/livesList", function (data, status) {
        var htmlStr = "";
        for (var i = 0; i < data.lives.length; i++) {
            htmlStr += "<option value=" + data.lives[i][0] + " id=option" + data.lives[i][0] + ">" + data.lives[i][0] + " (" + data.lives[i][1] + ")</option>";
        }
        document.getElementById("live-select").innerHTML = htmlStr;
        text.innerHTML = data.lives[0][1];
        changeLive();
    });
}

function Animatedtoggle(){
    toggle.classList.toggle("active");

    if(toggle.classList.contains("active")){
        text.innerHTML = "ON";
    }else{
        text.innerHTML="OFF";
    }
}

function toggleLive() {
    Animatedtoggle();
    $.get("http://" + host + ":3000/api/toggleLiveStatus?id=" + document.getElementById("live-select").value, function (data, status) {
        text.innerHTML = data.status;
        document.getElementById("option" + document.getElementById("live-select").value).innerHTML = document.getElementById("live-select").value + " (" + data.status + ")";
    });
}
function changeLive() {
    playLive(document.getElementById("live-select").value);
    $.get("http://" + host + ":3000/api/liveStatus?id=" + document.getElementById("live-select").value, function (data, status) {
        text.innerHTML = data.status;
    });
}
function playLive(i) {
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById("videoElement");
        var flvPlayer = flvjs.createPlayer({
            type: "flv",
            url: "http://" + host + ":8000/live/" + document.getElementById("live-select").value + ".flv"
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
}