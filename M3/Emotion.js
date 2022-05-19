const video = document.getElementById("video");
let emotion;

/****Loading the model ****/
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  console.log('model load finished')
]).then(startVideo);

function startVideo() {
  console.log('video starts')
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}


/****Event Listeiner for the video****/
video.addEventListener("playing", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  let container = document.querySelector(".container");
  container.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    /****Drawing the detection box and landmarkes on canvas****/
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    /****Setting values to the DOM****/
    if (resizedDetections && Object.keys(resizedDetections).length > 0) {
      const expressions = resizedDetections.expressions;
      const maxValue = Math.max(...Object.values(expressions));
      emotion = Object.keys(expressions).filter(
        item => expressions[item] === maxValue
      );
      document.getElementById("emotion").innerText = `Emotion - ${emotion[0]}`;
    }
  }, 10);
});

function putemoji() {
    var textdisplay = document.getElementById("text-display");
    let emo = String(emotion[0])
    console.log(emo)
    switch (emo) {
        case 'neutral':
            textdisplay.innerText += '😐'
            break;
        case 'sad' :
            textdisplay.innerText += '🙁'
            break;
        case 'angry' :
            textdisplay.innerText +='😠'
            break;
        case 'surprised' :
            textdisplay.innerText += '😮'
            break;
        case 'happy' :
            textdisplay.innerText += '😊'
            break;
        case 'disgusted' :
            textdisplay.innerText += '😖'
            break;
    }
}
