let recordBtn = document.getElementById("record_button");
let videoElement = document.getElementById("videoElement");
let captureBtn = document.getElementById("capture_button");
let time = document.querySelector("#time");
let filterArr = document.querySelectorAll(".filter");
let uiFilter = document.querySelector(".ui_filter");
let recordState = false;
let currentFilterColor = "";
let clearObj;
let buffer = [];
let constraints = {
    video: true,
    audio: true
}
navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
        videoElement.srcObject = mediaStream;
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.addEventListener("dataavailable", function (e) {
            buffer.push(e.data);
        })

        mediaRecorder.addEventListener("stop", function () {
            let blob = new Blob(buffer, {
                type: "video/mp4"
            });
            const url = window.URL.createObjectURL(blob);

            let a = document.createElement("a");
            a.download = "Video.mp4";
            a.href = url;
            a.click();
            buffer = [];
        })
    })
    .catch(function (err) {
        alert("To proceed further,please allow both camera and audio");
        console.log(err);
    });

recordBtn.addEventListener("click", function () {
    if (!mediaRecorder) {
        alert("First Allow Permissions");
    }
    if (recordState == false) {
        recordState = true;
        mediaRecorder.start();
        startCounting();
        // recordBtn.innerHTML=`Recording Started`;
        recordBtn.classList.add("record_animation");

    } else {
        recordState = false;
        mediaRecorder.stop();
        stopCounting();
        // recordBtn.innerHTML=`Record`;
        recordBtn.classList.remove("record_animation");
    }
})

captureBtn.addEventListener("click", function () {
    captureBtn.classList.add("capture_animation");
    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    let tool = canvas.getContext("2d");

    tool.drawImage(videoElement, 0, 0);
    tool.fillStyle = currentFilterColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
    let link = canvas.toDataURL();
    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.download = "Image.png";
    anchor.click();
    anchor.remove();
    canvas.remove();

    setTimeout(function () {
        captureBtn.classList.remove("capture_animation");
    }, 1000);
});


function startCounting() {
    time.classList.add("time_active");
    let timeCount = 0;
    clearObj = setInterval(function () {
        let seconds = (timeCount % 60) < 10 ? `0${timeCount%60}` : `${timeCount%60}`;
        let minutes = (timeCount / 60) < 10 ? `0${Number.parseInt(timeCount/60)}` : `${Number.parseInt(timeCount/60)}`;
        let hours = (timeCount / 3600) < 10 ? `0${Number.parseInt(timeCount/3600)}` : `${Number.parseInt(timeCount/3600)}`;
        time.innerText = `${hours}:${minutes}:${seconds}`;
        timeCount++;
    }, 1000);
}

function stopCounting() {
    time.classList.remove("time_active");
    time.innerText = `00:00:00`;
    clearInterval(clearObj);
}

for (let i = 0; i < filterArr.length; i++) {
    filterArr[i].addEventListener("click", function () {
        let color = filterArr[i].style.backgroundColor;
        if (color) {
            uiFilter.classList.add("ui_filter_active");
            uiFilter.style.backgroundColor = color;
            currentFilterColor = color;
        } else {
            uiFilter.classList.remove("ui_filter_active");
            uiFilter.style.backgroundColor = "";
            currentFilterColor = "";
        }
    });
}