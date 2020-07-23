
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:3030');

// Connection opened
socket.addEventListener('open', function (event) {
  console.log('Socket connected');
  //request device list
  socket.send(JSON.stringify({ev: 'devices.get'}));
});

// Listen for messages
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
});

socket.addEventListener('error', (err) => {
  console.error(err);
});


export default socket;