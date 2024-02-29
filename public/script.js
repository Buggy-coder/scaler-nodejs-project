const socket = io();

let username;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');

do{
    username = prompt(`please enter your name to proceed...`);
}while(!username)

if(username){
    sendServerMessage(username,'join');
}

function sendServerMessage(username, type){
    let msg;
    if(type==='join'){
        msg = {
            message: `<b>${username}</b> has joined the chat`,
            type: 'join',
            user: username,
        } 
    }
    else{
        msg = {
            message: `<b>${username}</b> has left the chat`, 
            type: 'left',
            user: username,
        }
    }
    

    socket.emit('toggle', msg);
}

socket.on('toggle', (txt)=>{
    let classAdd = txt.type+"_message";
    let toggleDiv = document.createElement('div');
    toggleDiv.classList.add(classAdd);
    toggleDiv.innerHTML=txt.message;
    messageArea.append(toggleDiv);
});

textarea.addEventListener('keyup', (e)=>{
    if(e.key==='Enter'){
        sendMessage(e.target.value);
        e.target.value= '';
    }
});

function sendMessage(txt){
    let msg = {
        name: username,
        message: txt.trim(),
    }

    appendMessage(msg, 'outgoing');

    socket.emit('message', msg)
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type,'message');
    
    let innerElement = `
        <h4>${msg.name}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML=innerElement;
    messageArea.appendChild(mainDiv);
    scrollToBottom();
}

socket.on('message', (msg)=>{
    appendMessage(msg, 'incoming');
})

function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight;
}

