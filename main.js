const form = document.querySelector('form');
const messagebox = document.querySelector('.messagebox');
const userInput = prompt('Enter a screenname:');
// const userInput = 'fizal';
let clientMessages = [];


function addUserBubble(username, message) {
  messagebox.innerHTML += `
  <div class="message user">
  <p class="message-body">
  ${message}
  </p>
  <img src="https://robohash.org/${username}.png?set=set4?&bgset=bg1" alt="avatar" class="avatar">
  <p class="username">${username}</p>
  </div>
  ` ; 
}

function addOtherPeopleBubble(username, message) {
  messagebox.innerHTML += `
  <div class="message">
  <img src="https://robohash.org/${username}.png?set=set4?&bgset=bg1" alt="avatar" class="avatar">
  <p class="message-body">
  ${message}
  </p>
  <p class="username">${username}</p>
  </div>
  ` ; 
}

const messages = firebase.database().ref();

  messages.on("value", function(snapshot) {
    messagebox.innerHTML = '';
    const dbMessages = snapshot.val();
    if(dbMessages){
      dbMessages.forEach(function (data, index){
        if (data.username === userInput) {
          addUserBubble(data.username,data.message);
        } else {
          addOtherPeopleBubble(data.username,data.message);
        }

        if(index+1 === dbMessages.length && data.username !== userInput){
          document.querySelector('audio').play()
        }

      });
      clientMessages = dbMessages;
    }
    window.scrollTo(0,document.body.scrollHeight);
  });

form.addEventListener('submit', function(e){
  e.preventDefault();
  // addUserBubble(userInput, e.target.message.value);
  clientMessages.push({username: userInput, message: e.target.message.value});
  messages.set(clientMessages);
  e.target.message.value = '';
});

