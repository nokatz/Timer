

function Timer(parent, width, height){

	this.canvas = document.createElement('canvas');
	this.canvas.style.width = width + 'px';
	this.canvas.style.height = height + 'px';
	this.canvas.tabIndex = '1';
	
	this.ctx = this.canvas.getContext('2d');
	
	this.ticking = false;
	
	
	// Alarm stuff
	// this.alarmStates = {OFF: 'off', SETTING: 'setting', SET: 'set', RING: 'ring'};
	this.alarmTime = null;
	
	this.alarm = new Audio();
	this.alarm.src = "assets/snd/alarm.wav";
	this.alarm.volume = 0.4;
	
	this.alarmPlaying = false;
	this.settingAlarm = false;

	this.iconHeight = 16;
	
	this.bell = new Image();
	this.bell.onload = () => {
		this.draw("0", "0", "0");	
	}
	this.bell.src = "assets/img/bell-144x116.png";
	
	this.bb = {x: 10, y: 14, w: 20, h: 16};

	this.canvas.addEventListener('click', (e) => {
		
		let rect = this.canvas.getBoundingClientRect();
		let mouseX = e.clientX - rect.left;
		let mouseY = e.clientY - rect.top;
		
		if(mouseX >= this.bb.x && mouseX <= this.bb.x + this.bb.w && mouseY >= this.bb.y && mouseY <= this.bb.y + this.bb.h){
			
			if(!this.alarmPlaying){
				this.setAlarm();			
			} else {
				this.alarm.pause();
				this.alarm.currentTime = 0;
				this.alarmPlaying = false;
			}			
		}
	});	
	
	this.selecting = 2;
	this.setH = 0;
	this.setM = 0;
	this.setS = 0;
	
	this.canvas.addEventListener('keydown', (e) => {
		// console.log(e.keyCode);
		
		switch(e.keyCode){
			
			case 37:
			if(this.selecting > 0){
				this.selecting -= 1;
			} else {
				this.selecting = 0;
			}
			break;
			
			case 39:
			if(this.selecting < 2){
				this.selecting += 1;
			} else {
				this.selecting = 2;
			}
			break;
			
			case 38:
			if(this.selecting === 2){
				this.setS++;
				if(this.setS > 59) this.setS %= 60;
			} else if(this.selecting === 1){
				this.setM++;
				if(this.setM > 59) this.setM %= 60;
			} else if(this.selecting === 0){
				this.setH++;
				if(this.setH > 23) this.setH %= 24;
			}
			break;
			
			case 40:
			if(this.selecting === 2){
				this.setS--;
				if(this.setS < 0) this.setS += 60;
			} else if(this.selecting === 1){
				this.setM--;
				if(this.setM < 0) this.setM += 60;
			} else if(this.selecting === 0){
				this.setH--;
				if(this.setH < 0) this.setH += 24;
			}
			break;
			
			case 13: 
			this.alarmTime = new Date(0, 0, 0, this.setH, this.setM, this.setS, 0);
			this.settingAlarm = false;
			break;
		}

		this.draw(this.setH, this.setM, this.setS);

	});
	// end of Alarm stuff
	
	parent.appendChild(this.canvas);

} 

Timer.prototype.setAlarm = function(){

	this.settingAlarm = true;
	this.draw(0, 0, 0);

}

Timer.prototype.start = function(){ 
   
	this.startTime = new Date();
	
	this.ticking = true;
	this.tick();
	
}

Timer.prototype.tick = function(){
	
	if(!this.ticking)
		return;
	
	this.newTime = new Date();
	this.time = this.newTime - this.startTime;

	this.time = new Date(this.time);
	
	if(
		this.time.getSeconds() === this.alarmTime.getSeconds() 
		&& this.time.getMinutes() === this.alarmTime.getMinutes() 
		&& this.time.getUTCHours() === this.alarmTime.getHours()
	){
		this.alarmPlaying = true;
		this.alarm.play();
		this.stop();
	}
	
	this.draw(this.time.getUTCHours(), this.time.getMinutes(), this.time.getSeconds());

	let self = this;
	setInterval(function(){self.tick();}, 1000);

}

Timer.prototype.stop = function(){
	this.ticking = false;
}

Timer.prototype.draw = function(h, m, s){

	if(s < 10)
		s = "0" + s;
	if(m < 10)
		m = "0" + m;
	if(h < 10)
		h = "0" + h;
	
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	

	this.ctx.font = this.canvas.height / 2 + "px " + "Helvetica";
	
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "middle";

	// alarm selecting stuff
	if(this.settingAlarm){
		this.ctx.fillStyle = "blue";
		let txt0 = this.ctx.measureText(h + ':').width;
		let txt1 = this.ctx.measureText(h + ':' + m + ':').width;
		let txt2 = this.ctx.measureText(h + ':' + m + ':' + s).width;
		let txtc = this.ctx.measureText(':').width;
		let off = 3;
		
		if(this.selecting === 2){
			this.ctx.fillRect(txt1 + off, 0, txt2 - txt1 + off, this.canvas.height);
		} else if (this.selecting === 1){
			this.ctx.fillRect(txt0 + off, 0, txt1 - txt0 - txtc + off, this.canvas.height);
		} else if(this.selecting === 0){
			this.ctx.fillRect(off, 0, txt0 - txtc + off, this.canvas.height);
		}
	}
	// end of alarm selecting stuff
	
	this.ctx.fillStyle = "white";
	
	this.ctx.fillText(
		h + ':' + m + ':' + s, 
		this.canvas.width / 2, 
		this.canvas.height / 2 + this.iconHeight / 2
	);
	
	// bell icon
	// this.ctx.drawImage(this.bell, 10, 14, 20, 16);
	this.ctx.drawImage(this.bell, this.bb.x, this.bb.y, this.bb.w, this.bb.h);

}