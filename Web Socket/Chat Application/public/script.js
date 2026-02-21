const socket = io();

const messagecontainer = document.getElementById('message-container');
const nameInput = document.getElementById('name');
const messageForm = document.getElementById('message-form');   
const messageInput = document.getElementById('message');

const feedbackEl = document.getElementById('feedback');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();

});

messageInput.addEventListener('focus', () => {
    socket.emit('feedback', { name: nameInput.value });
});

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', { name: nameInput.value });
});

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', { name: '' });
});

socket.on('clients-total', (data) => {
    document.getElementById('clients-total').innerText = `${data} clients online`;
});

socket.on('chat-message', (data) => {
    console.log('Received message:', data);
    addMessageToUI(false, data);
});

socket.on('feedback', (data) => {
    if (data.name) {
        feedbackEl.innerText = `${data.name} is typing...`;
    } else {
        feedbackEl.innerText = '';
    }
});

function sendMessage() {
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    console.log(data);
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
    socket.emit('feedback', { name: '' });
}

function addMessageToUI(isOwnMessage, data) {
    const element = `
        <li class="${isOwnMessage ? 'message-left' : 'message-right'}">
            <span class="message-name">${data.name}</span>
            <p class="message-text">
                ${data.message}
            </p>
            <span class="message-time">${new Date(data.dateTime).toLocaleString()}</span>
        </li>
    `;
    messagecontainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messagecontainer.scrollTo(0, messagecontainer.scrollHeight);
}

