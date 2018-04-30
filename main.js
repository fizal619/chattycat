const form = document.querySelector('form');
const messagebox = document.querySelector('.messagebox');

//get a screen name for the user
const userInput = prompt('Enter a screen name:');

// our local cache of the messages to add to when a message is sent or recieved .
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
// subscribe to any value changes on the whole database.
//this is like an event listener. Use once for one time reading.
messages.on("value", function(snapshot) {
  messagebox.innerHTML = '';
  // dbMessages is the array from firebase
  const dbMessages = snapshot.val();
  if(dbMessages){
    //loop the messages and display it on the page
    dbMessages.forEach(function (data, index){
      if (data.username === userInput) {
        addUserBubble(data.username,data.message);
      } else {
        addOtherPeopleBubble(data.username,data.message);
      }
      //in english: if this is the last message and it isn't yours
      if(index+1 === dbMessages.length && data.username !== userInput){
        //meow
        document.querySelector('audio').play()
      }
    });
    //update our local messages cache with the db.
    clientMessages = dbMessages;
  }
  //move page to the bottom. 
  window.scrollTo(0,document.body.scrollHeight);
});

form.addEventListener('submit', function(e){
  e.preventDefault();
  //add the user's message to the array 
  clientMessages.push({username: userInput, message: e.target.message.value});
  //then set the remote db to it
  messages.set(clientMessages);
  e.target.message.value = '';
});

