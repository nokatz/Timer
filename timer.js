

function Timer(parent, width, height){

	this.canvas = document.createElement('canvas');
	this.canvas.style.width = width + 'px';
	this.canvas.style.height = height + 'px';
	
	this.ctx = this.canvas.getContext('2d');
	
	this.ticking = false;

	parent.appendChild(this.canvas);
	
	this.draw("0", "0", "0");

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
	
	this.ctx.fillStyle = "white";

	this.ctx.font = this.canvas.height / 2 + "px " + "Helvetica";
	
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "middle";
	
	this.ctx.fillText(
		h + ':' + m + ':' + s, 
		this.canvas.width / 2, 
		this.canvas.height / 2);

}