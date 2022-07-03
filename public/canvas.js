

let canvas = document.querySelector('canvas')
canvas.height = window.screen.height
canvas.width = window.screen.width

let penColor = 'red'
let penWidth = 2;

let eraserColor = 'white'
let eraserWidth = '3'

let canvasUndoRedoData = []
let tracker =0 //represent which action to performmed

let tool = canvas.getContext('2d');
tool.strokeStyle = penColor


let isDrawing = false;

canvas.addEventListener('mousedown', (e) => {

    isDrawing = true
    // tool.beginPath()
    // tool.moveTo(e.clientX, e.clientY);

    let data = {
        x: e.clientX,
        y: e.clientY,
        penColor: penColor,
        width:penWidth
    }

//   beginPath(data)
    socket.emit("beginPath",data)
})

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
      let data = {

                x: e.clientX,
          y: e.clientY
                
        }
         socket.emit('drawStroke', data);
    }
})


canvas.addEventListener('mouseup',()=>{
    isDrawing=false

    let imageData = canvas.toDataURL();
    canvasUndoRedoData.push(imageData);
    tracker = canvasUndoRedoData.length-1;

})



let toolColorYellow = document.querySelector('.toolColorYellow')
toolColorYellow.addEventListener('click',()=>{
    penColor = 'yellow';
    tool.strokeStyle = penColor

})

let toolColorRed = document.querySelector('.toolColorRed')
toolColorRed.addEventListener('click',()=>{
    penColor = 'red';
    tool.strokeStyle = penColor

})

let toolColorBlue = document.querySelector('.toolColorBlue')
toolColorBlue.addEventListener('click',()=>{
    penColor = 'blue';
    tool.strokeStyle = penColor

})
let toolColorBlack = document.querySelector('.toolColorBlack')
toolColorBlack.addEventListener('click',()=>{
    penColor = 'black';
    tool.strokeStyle = penColor

})
let toolColorPink = document.querySelector('.toolColorPink')
toolColorPink.addEventListener('click',()=>{
    penColor = 'pink';
    tool.strokeStyle = penColor

})
let toolColorGreen = document.querySelector('.toolColorGreen')
toolColorGreen.addEventListener('click',()=>{
    penColor = 'green';
    tool.strokeStyle = penColor

})


let rangeInput = document.querySelector('.inputPentool input');
rangeInput.addEventListener('change',()=>{
    penWidth = rangeInput.value;
    tool.lineWidth = penWidth
})


let isEraser =false
let newEraser = document.querySelector('.eraser');
newEraser.addEventListener('click',()=>{
    isEraser ? isEraser=false:isEraser=true;

    if(isEraser){
        console.log("a");
        penColor='white'
        tool.strokeStyle =  penColor
        tool.lineWidth = eraserWidth

    }else if(!isEraser){

        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth

    }

})


let eraserRange = document.querySelector('.inputeraser input');
eraserRange.addEventListener('change',()=>{
   eraserWidth = eraserRange.value;
   tool.lineWidth = eraserWidth;
})


let file_download = document.querySelector('.file_download');
file_download.addEventListener('click',()=>{
    let url = canvas.toDataURL()

    let a  =  document.createElement('a');
    a.href = url
    a.download = "whiteBoardImage.jpg"
    a.click()
})



let undo =  document.querySelector('.undo');
undo.addEventListener('click',()=>{
    
    if(tracker>0){ tracker--;
      console.log(tracker);}
    
    
    
      socket.emit('undoRedo', {
        tracker: tracker,
        canvasUndoRedoData: canvasUndoRedoData
      });
})
let redo =  document.querySelector('.redo');
redo.addEventListener('click',()=>{
    
    if(tracker<canvasUndoRedoData.length-1) {tracker++;
    console.log(tracker);}

    // canvasDrawImageAgain(tracker, canvasUndoRedoData)
     socket.emit('undoRedo', {tracker:tracker,canvasUndoRedoData:canvasUndoRedoData});
    

    
})


function canvasDrawImageAgain(obj){

    
    // let newImage =  new Image()
    // newImage.src = obj.canvasUndoRedoData[obj.tracker];
    // newImage.onload = function(){
    //     tool.drawImage(newImage,0,0,canvas.width,canvas.length)
    // }
  
    track=obj.tracker
    undoredoarray=obj.canvasUndoRedoData
    let url=undoredoarray[track]
    let newimg=new Image();
    newimg.src=url
    tool.clearRect(0,0,canvas.width,canvas.height) 
    newimg.onload=(e)=>{
        
        tool.drawImage(newimg,0,0,canvas.width,canvas.height)
    }
    
    console.log("hys");
    
}


    





  function beginPath(data) {
      tool.beginPath();
      tool.moveTo(data.x, data.y);
      tool.strokeStyle = data.penColor
      tool.lineWidth = data.width
}
  
   function drawStroke(data) {
     tool.lineTo(data.x, data.y);
     tool.stroke();
}
   
socket.on("beginPath",(data)=>{
    beginPath(data)
})
socket.on("undoRedo",(data)=>{
    canvasDrawImageAgain(data)
})
socket.on("drawStroke",(data)=>{
    drawStroke(data)
})
