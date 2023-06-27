const urlParams = new URLSearchParams(window.location.search);
const nickname = JSON.parse(localStorage.getItem("payload")).nickname

// const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + '127.0.0.1:8000'
    + '/ws/chat/'
    + 'all'
    + '/'
);

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const chatBox = document.querySelector('#chat-log')

    let lastSendNickname = ''
    if (chatBox.childNodes.length >= 1) {
        lastSendNickname = chatBox.lastChild.firstChild.innerText
    }

    const chatDiv = document.createElement('div')
    chatDiv.setAttribute('id', 'chat_div')
    chatDiv.setAttribute('class', 'chat_div')
    chatBox.appendChild(chatDiv)

    const chatNickName = document.createElement('div')
    chatNickName.setAttribute('class', 'chat_nickname')
    chatNickName.innerText = data.nickname
    chatDiv.appendChild(chatNickName)

    if (nickname == data.nickname) {
        chatDiv.style = 'margin-left: auto;'
        chatNickName.style.display = "none"
    }
    else {
        chatDiv.style = 'margin-right: auto;'
        chatNickName.style = 'margin-right: auto;'
        if (data.nickname == lastSendNickname) {
            chatNickName.style.display = "none"
        } else {
            chatNickName.style.display = "block"
        }
    }
    const chatMessage = document.createElement('div')
    chatMessage.setAttribute('class', 'chat_message')
    chatMessage.innerText = data.message
    chatDiv.appendChild(chatMessage)

    chatBox.scrollTop = chatBox.scrollHeight;
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function (e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    if (messageInputDom.value != '') {
        const message = messageInputDom.value;
        chatSocket.send(JSON.stringify({
            'message': message,
            'nickname': nickname,
        }));
        messageInputDom.value = '';
    }
};
