let recordBtn=document.getElementById("record_button");
let videoElement=document.getElementById("videoElement");
let recordState=false;
let buffer=[];
let constraints={
    video:true,
    audio:true
}
navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream){
    videoElement.srcObject=mediaStream;
    mediaRecorder=new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable",function(e){
        buffer.push(e.data);
    })

    mediaRecorder.addEventListener("stop",function(){
        let blob=new Blob(buffer,{type:"video/mp4"});
        const url=window.URL.createObjectURL(blob);

        let a=document.createElement("a");
        a.download="Video.mp4";
        a.href=url;
        a.click();
        buffer=[];
    })
})
.catch(function(err){
    alert("To proceed further,please allow both camera and audio");
    console.log(err);
});

recordBtn.addEventListener("click",function(){
    if(!mediaRecorder){
        alert("First Allow Permissions");
    }
    if(recordState==false){
        recordState=true;
        mediaRecorder.start();
        recordBtn.innerHTML=`🔴 Recording Started`;

    }
    else{
        recordState=false;
        mediaRecorder.stop();
        recordBtn.innerHTML=`🔴 Record`;
    }
})