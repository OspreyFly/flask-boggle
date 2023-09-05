// Get a reference to the form element
const form = document.getElementById('guess-form');
const msg = document.getElementById('msg-header');
const score = document.getElementById('score');
const highScoreh2 = document.getElementById('high_score');
const pastGuess = document.getElementById('past-guess');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const stats = {};
let secondsLeft = 60;
let timerInterval;
let puzzleAnswers = [];
let scoreCount = 0;
score.innerHTML = `Your Score Is: ${scoreCount}`;

// Add an event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();
    submitGuess();
    console.log("end of event listener");
});

function submitGuess() {
    console.log("submitGuess has been called");
    // Check if the timer has run out
    if (secondsLeft <= 0) {
      messageElement.textContent = 'Time is up! No more guesses allowed.';
      updateStats();
      return;
    }
    else {
        // Get the form data
        const formData = new FormData(form);

        // Convert form data to an object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Send a POST request using Axios
        axios.post('http://127.0.0.1:5000/submit', data)
            .then(response => {
                const responseData = response.data.result; 
                const guess = data.guess;
                const guessList = [];
                guessList.push(data.guess);
                const newItem = document.createElement('li');
                newItem.textContent = data.guess;
                if(responseData == 'ok' ){
                    msg.innerHTML = "Good Job!";
                    if (puzzleAnswers.includes(data.guess)){
                        console.log("Already used that word!");
                    }
                    else{
                        pastGuess.appendChild(newItem);
                        scoreCount += data.guess.length;
                        score.innerHTML = `Your Score Is: ${scoreCount}`;
                        puzzleAnswers.push(data.guess)
                    }
                }
                else if(responseData == 'not-on-board' ){
                    msg.innerHTML = "Where did you see that?";
                }
                else if(responseData == 'not-a-word' ){
                    msg.innerHTML = "Nice try, find a real word!"
                }
                else{
                    msg.innerHTML = "Something went wrong!"
                }
                form.reset()
            })
            .catch(error => {
                console.error('Error submitting form:', error);
            });
    } 
}
    
async function updateStats(){
    stats.scoreCount = scoreCount;
    try {
        const response = await axios.post('http://127.0.0.1:5000/stats', stats);
        const highScore = response.data.high_score;
        const numVisits = response.data.num_visits;
        highScoreh2.textContent = `Your high score is ${highScore} in ${numVisits} attempts!`;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}
function updateTimer() {
    timerElement.textContent = secondsLeft;
    if(secondsLeft > 40){
        timerElement.setAttribute("style", "color: green");
    }
    else if(secondsLeft > 20){
        timerElement.setAttribute("style", "color: orange");
    }
    else{
        timerElement.setAttribute("style", "color: red");
    }
  }

function startTimer() {
  timerInterval = setInterval(function() {
    secondsLeft--;
    updateTimer();
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      messageElement.textContent = 'Time is up. No more guesses allowed.';
    }
  }, 1000);
}

startTimer();

