const socket = io('http://localhost:8000')

// Starting game and Leaving room

const startGame = document.getElementById('start_game')
const roomCode = document.getElementById('room_id').value
const leaveRoom = document.getElementById('leave_room')
var word = document.getElementById('word')
const roundno = document.getElementById('roundno')
const playerlist = document.getElementById('playerlist')
var playerNames = document.getElementsByClassName('kickButtons')

const userName = document.getElementById('username').value
const user = document.getElementById('user').value
const canvasURL = document.getElementById('canvasURL').value

// Canvas and Drawings
const canvas = document.getElementsByClassName('whiteboard')[0];
const colors = document.getElementsByClassName('color');
const context = canvas.getContext('2d');

// Chatbox and Messaging
const alertBox = document.getElementById('alert-box')
const messageBox = document.getElementById('messages-box')
const messageInput = document.getElementById('message-input')
const sendBtn = document.getElementById('send-btn')

var currentPlayer = document.getElementById("currentPlayer").value;
var rect = canvas.getBoundingClientRect();


// Start Game button is pressed
if(startGame.value == "working") {
    startGame.addEventListener('click',()=>{
        $.ajax({
            type: "POST",
            url: "../../start_game/",
            data:{
                roomCode:roomCode, 
                username:userName,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            datatype:'json',
            success: function (data) {
                socket.emit('update',data)
            },
        });
    })
}

// Leave room button
leaveRoom.addEventListener('click',()=>{
    $.ajax({
        type: "POST",
        url: "../../leave_room/",
        data:{
            roomCode:roomCode, 
            username:userName,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
        datatype:'json',
    });
    sleep(1000)
    window.location.href = '../../menu/';
})

// Timer

var started = document.getElementById('started').value
const info = document.getElementById('info')

function makeTimer() {
    if(started != "False") {
        if(user==currentPlayer) {
            messageInput.disabled = true ;
        }
        var startTime = document.getElementById('startTime').value
        startTime = startTime. slice(1, -1);   
        var end=new Date(startTime);
        var endTime = new Date(end.getTime() + 60000);
        endTime = (Date.parse(endTime) / 1000)
    
        var now = new Date();
        now = (Date.parse(now) / 1000);

        var timeLeft = endTime - now;

        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
        var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
        var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

        if(seconds>30) {
            if(currentPlayer != user) {
                hidden_word = ''
                for (var i=0; i<word.value.length; i++) {
                    if(word.value.charAt(i)!=' ') {
                        hidden_word += '*'
                    }
                    else hidden_word += ' '
                } 

                word.innerHTML = '<h3>'+hidden_word+'</h3>' 
            }
        }
         else if(seconds<=30) {
            if(currentPlayer != user) {
                hidden_word = ''
                for (var i=0; i<word.value.length; i++) {
                    if(i==0 || i==word.value.length-1) {
                        hidden_word += word.value[i]
                    }
                    else if(word.value.charAt(i)!=' ') {
                        hidden_word += '*'
                    }
                    else hidden_word += ' '
                } 

                word.innerHTML = '<h3>'+hidden_word+'</h3>' 
            }
            
        }

        if (seconds <= 0) {
            if(currentPlayer == user) {
                $.ajax({
                    type: "POST",
                    url: "../../update_player/",
                    data:{
                        roomCode:roomCode, 
                        username:userName,
                        'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
                    },
                    datatype:'json',
                    success: function (data) {
                        if(data['bool']){
                            socket.emit('update',data)
                        }
                        
                    },
                });
            }
            
        
        }
        if (seconds < "10") { seconds = "0" + seconds; }
        $("#time").html("<h4>Time Left<br><h2> " + seconds + "s</h2> </h4>");
    } 
}


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
        
setInterval(function() { makeTimer(); }, 1000);

socket.on('broadcastUpdates', update=>{
    console.log('updated ...')
    currentPlayer = update['currentPlayer']
    console.log(currentPlayer)
    word.value = update['word']
    if(user==currentPlayer) {
        word.innerHTML = '<h3>'+update['word']+'</h3>'
        messageInput.disabled = true ;
    }
    
    else {
        messageInput.disabled = false ;
        hidden_word = ''
        for (var i=0; i<update['word'].length; i++) {
            if(update['word'].charAt(i)!=' ') {
                hidden_word += '*'
            }
            else hidden_word += ' '
        } 

        word.innerHTML = '<h3>'+hidden_word+'</h3>' 
    }
    roundno.innerHTML = `<h2 class="round">Round ${update['roundNo']}</h2>`
    
    playerlist.innerHTML = '' 
    for(player in update['playerlist']) {
        if(player == currentPlayer) {
            playerlist.innerHTML += `<div class="col-5"><p style="font-size: 25px; color:red"> ${player} </p></div>`
        }
        else {
            playerlist.innerHTML += `<div class="col-5"><p style="font-size: 25px; color:white"> ${player} </p></div>`
        }
        playerlist.innerHTML += `
        <div class="col-2">
            <p style="font-size: 25px; color: white"> ${update['playerlist'][player]} </p>
            
        </div>
        
        `

        if(player != userName) {
            playerlist.innerHTML += `<div class="col-5">
            <p style="font-size: 25px; color: white"> ${update['votelist'][player]} &nbsp;
            <button class="kickButtons btn-sm btn-danger" id="${player}"><i class="fa fa-window-close" aria-hidden="true"></i></button>
            </p></div>`
        }
        else {
            playerlist.innerHTML += `<div class="col-5">
            <p style="font-size: 25px; color: white"> ${update['votelist'][player]}
            </p></div>`
        }
    
    }
    if (update['canvasurl']=='none'){
        context.clearRect(0, 0, canvas.width, canvas.height);
        // context.globalAlpha = 0.5;
        context.fillStyle = "rgba(200, 200, 200, 0.4)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalAlpha = 1;
    }


    if (update['clearcanvas']) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // context.globalAlpha = 0.5;
        context.fillStyle = "rgba(200, 200, 200, 0.4)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalAlpha = 1;
    }

    if(update['started']==true) {
        started = "True"
        startGame.value = "over"
        startGame.className = "btn btn-secondary mt-2"
        document.getElementById('startTime').value = update['startTime']
    }

    if(update['started']==false && update['embryo']==false) {
        sleep(3000)
        $.ajax({
            type: "POST",
            url: "../../leave_room/",
            data:{
                roomCode:roomCode, 
                username:userName,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            datatype:'json',
        });
        window.location.href = '../../menu/';
    } 
    playerNames = document.getElementsByClassName('kickButtons')
    for (var i = 0; i < playerNames.length; i++) {
        playerNames[i].addEventListener('click', onKickVote);
    }
})

const handleAlert = (msg, type) => {
    alertBox.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${msg}
        </div>
    `
    setTimeout(() => {
        alertBox.innerHTML = ""
    }, 5000);
}

socket.emit('joinDetails', {
    'roomCode': roomCode ,
    'userName': userName ,
})

socket.on('welcome', msg=>{
    console.log(currentPlayer)
    if(user==currentPlayer) {
        $.ajax({
            type: "POST",
            url: "../../get_data/",
            data:{
                roomCode:roomCode, 
                username:userName,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            datatype:'json',
            success: function (data) {
                socket.emit('update',data)
            },
        });
    }
    // handleAlert(msg, 'primary')
})

socket.on('leave', msg=>{

        $.ajax({
            type: "POST",
            url: "../../get_data/",
            data:{
                roomCode:roomCode, 
                username:userName,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            datatype:'json',
            success: function (data) {
                socket.emit('update',data)
            },
        });
})

socket.on('kickVote', player=>{
    console.log("Kicking")
    console.log(player)
    if (player != userName) return
    $.ajax({
        type: "POST",
        url: "../../leave_room/",
        data:{
            roomCode:roomCode, 
            username:userName,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
        datatype:'json',
        success: function (data) {
            socket.emit('update',data)
        },
    });
    sleep(1000)
    window.location.href = '../../menu/';
})

sendBtn.addEventListener('click',()=>{
   
    let message = messageInput.value
    if(messageInput.value == "") return
    messageInput.value = ""

    $.ajax({
        type: "POST",
        url: "../../store_msg/",
        data:{
            message:message,
            roomCode:roomCode, 
            username:userName,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
        datatype:'json',
        success: function (data) {
            // If guess is correct, answer is not displayed
            if(data['guess']) {
                message = '**correct**'  
                messageInput.disabled = true;
                socket.emit('update',data)
            }

            msg = {
                'message':message ,
                'username':userName ,
            }
            messageBox.innerHTML = `<div class="row justify-content-end" style="margin-bottom: 10px;">
                                    <div class="col-4 msg-self">
                                    <b>${userName}</b><br>
                                    ${message}
                                    </div></div>` + messageBox.innerHTML 
        
            socket.emit('message', msg)
        },
    }); 

    
})

// Send message if enter key is pressed
messageInput.addEventListener("keyup",function(event){
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
        event.preventDefault();
      // Trigger the button element with a click
        sendBtn.click();
    }
})

socket.on('messageToClients', msg=>{
    messageBox.innerHTML = `<div class="row justify-content-start" style="margin-bottom: 10px;">
                            <div class="msg-other">
                            <b>${msg['username']}</b><br>
                            ${msg['message']}
                            </div></div>` + messageBox.innerHTML
})


// Get canvas data of room 
var Image = new Image;
Image.onload = function(){
    context.drawImage(Image, 0, 0, canvas.width, canvas.height)
};
if (canvasURL!='none'){
    Image.src = canvasURL;
}
    

// Stores current brush color
var current = {
    color: 'black'
};
// Whether pen is down or not
var drawing = false;

// Canvas events
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mouseout', onMouseUp);
canvas.addEventListener('mousemove', throttle(onMouseMove, 10));

// Color button events
for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate);
}

for (var i = 0; i < playerNames.length; i++) {
    playerNames[i].addEventListener('click', onKickVote);
}

function onKickVote(e) {
    console.log(userName)
    console.log($(this).attr('id'))
    if ($(this).attr('id') == userName) return   
     
    
    $.ajax({
        type: "POST",
        url: "../../kick_vote/",
        data:{
            kicker: userName,
            kicked: $(this).attr('id'),
            room: roomCode,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
        datatype: 'json',
        success: function (data) {
            socket.emit('update',data)
            if (data['to_kick'] != null) {
                socket.emit('kickPlayer', data['to_kick'])
            }
        },
    });
}



// Receiving broadcast
socket.on('drawing', onDrawingEvent);

// If window is resized
// window.addEventListener('resize', onResize, false);
onResize();

// Utility Function
function drawLine(x0, y0, x1, y1, color, emit){
    // Drawing a line
    if(started == 'False') return

    if(currentPlayer == user || !emit) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 5;
        if (color == 'white') {
            context.lineWidth = 40;
        }
        context.moveTo(x0-rect.left, y0-rect.top);
        context.lineTo(x1-rect.left, y1-rect.top);
        context.stroke();
        context.closePath();

        if(!emit) return ;
        
        var w = canvas.width;
        var h = canvas.height;

        var canvas_url = canvas.toDataURL("image/png");

        $.ajax({
            type: "POST",
            url: "../../store_canvas/",
            data:{
                canvas_url:canvas_url,
                roomCode:roomCode, 
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            datatype:'json',
        });

        // Sending ratios because height and width could vary
        socket.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color
        });
    }
}

// Position when down
function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
}

// Draw once the mouseUp event happens
function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
}

// Draw once the mouse moves
function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
}

var color = {
    c1: '#fff100',
    c2: '#ff8c00',
    c3: '#e81123',
    c4: '#ec008c',
    c5: '#68217a',
    c6: '#00188f',
    c7: '#00bcf2',
    c8: '#00b294',
    c9: '#009e49',
    c10: '#bad80a',
    c11: 'black',
    c12: 'white',
}

// Colour change
function onColorUpdate(e){
    current.color = color[e.target.className.split(' ')[1]];
}

// Drawing received from other sockets 
function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
}

// limit the number of events per second
function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
        var time = new Date().getTime();

        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}

// Making the canvas fill its encloser
function onResize() {
    canvas.width = window.innerWidth*0.40;
    canvas.height = window.innerHeight*0.60;
    rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.globalAlpha = 0.5;
    context.fillStyle = "rgba(200, 200, 200, 0.4)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
}