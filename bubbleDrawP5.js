//*************************************
//優化程式碼「物件設計」，把物件當作參數做傳遞
//優點：程式碼看起來會比較簡潔
//*************************************
var serial;          // variable to hold an instance of the serialport library
var portName = 'COM6'; // fill in your serial port name here
var inData;                            // for incoming serial data
var outData = 0;                       // for outgoing data
var index;
var column = 3;
var row = 3;
var mybubble;
var bubbles = [];
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	for (var i = 0; i < 300; i++) {
		let bubble = generateRandombubble();
		// print(bubble)
		bubbles.push(bubble);
	}
	 mybubble = {
		x: width / 2,
		y: height / 2,
		size: 2,
		color: "#FFC0CB",
	 }

//set up communication port
  serial = new p5.SerialPort(); 
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port// make a new instance of the serialport library
  
}

function generateRandombubble(x, y){
	return {
		// x: random(width), 
		// y: random(height), 
		x: x || random(width),
		y: y || random(height),
		//size: random(2),
    size: 0.1,
		color: "#FFC0CB",
    opacity: 0.2,
	}
}


//【優化2】因應「把物件當作參數作為傳遞」，參數內直接改成mybubble，又或改成bubble更簡易
function drawbubble(bubble) {
	push(); 
	translate(bubble.x, bubble.y); //【優化2】
	rotate(bubble.size); //【優化2】
	fill(255,192,203);
	ellipse(0, 0, 2);
  noStroke();
	ellipseMode(CENTER);
	//fill(bubble.color);
  fill(255,192,203,20);
  noStroke();

  
		for (var i = 0; i < 16; i++) {
			//ellipse(30, -20, 120 * bubble.size, 40); //【優化2】
			//line(30, 0, 150* bubble.size, -10);
      ellipse(0,0,100*bubble.size,100*bubble.size);
      noStroke();
			rotate(PI / 8);
		}
		pop();
}

	
	//var list = ["#acf39d", "#e85f5c", "#9cfffa", "#773344", "#e3b5a4"]
	// 【優化3:用陣列來處理物件】以下程式碼可去除
	// var sizes = [1, 0.5, 0.2, 0.8]
	// var positionLisX = [300, 600, 500]
	// var positionLisY = [160, 400, 200]
	// var vYList = [1, 2, 3]
	// var colorList = ["#acf39d", "#e85f5c", "#9cfffa"]

	function mousePressed() {
		var bubble = generateRandombubble(mouseX, mouseY);
		bubbles.push(bubble);
	}

	function draw() {

		background(0);
		 // display the incoming serial data as a string:
    //text("incoming value: " + inData, 30, 30);
    //text("outcoming value: " + outData, 30, 30);
    
    
    
		for(var i=0;i<bubbles.length;i++){
			let bubble = bubbles[i];
			drawbubble(bubble); 
			
			if (dist(mouseX, mouseY, bubble.x, bubble.y) < 100) {
				bubble.size = lerp(bubble.size, 2, 0.1); //
			} else {
				bubble.size = lerp(bubble.size, 0, 0.02);//
			}
		}
  
  // set up serial output, to write the control value to the port
 
  outData = Math.floor(mouseY/height*column)*column+Math.floor(mouseX/width*row)+1;//ask cjb
  serial.write(outData);


	}


// Following functions print the serial communication status to the console for debugging purposes

function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.');
}

function serialEvent() {
  inData = Number(serial.read());
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
