 
let body = document.getElementById('timer-container');
let startBtn = document.getElementById('start-btn');


let timer = new Timer(body, 300, 140); 
// startBtn.focus();

startBtn.addEventListener('click', (e) => {
	
	if(!timer.ticking){
	
		timer.start();
		e.target.textContent = "Stop";
	
	} else {
	
		timer.stop();
		e.target.textContent = "Start";
	
	}
});



