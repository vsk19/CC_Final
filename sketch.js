
let serial; // variable for the serial object

let button_pressed = "waiting for data"; // holds signal from board
let last_button = 0;

var road_loop;
let tesla_dash;
let self_drive;
let disengage;
let rainbow_road;
let peach;
let toad;
let lakitu;
let mariokart_music;

let subaru;
let audi;
let brackets;

let just_played = false;

let easing = 0.01;
let pos_x = 1000;

// tracks number of frames elapsed
// used to make the self driving deactived message go away after a bit
let frames_elapsed = 0;

// represents a car or mariokart character
class RoadObject {

  // object stores the character type, 
  // initial position, 
  // image scale
  // and destination + easing to create smooth random motion
  constructor(char_type, position, scale) {
    this.char_type = char_type;
    this.position = position;
    this.initial_position = [position[0], position[1]];
    this.scale = scale;
    // this.target = position[0] + Math.floor(Math.random(0, 300));
    this.movement_arr = [-50, 30, -40, -30, 100, 150];
    this.target = position[0] - 30;

    if (char_type == "audi" || char_type == "subaru") {
      this.easing = 0.004;
    } else {
      this.easing = 0.07;
    }
    
  }

  // displays character/car
  show() {
    // console.log(this.position);
    // this.position[0] = int(this.position[0]);

    if (this.char_type == "toad") {
      image(toad, this.position[0], this.position[1], toad.width * this.scale, toad.height * this.scale);
    } else if (this.char_type == "peach") {
      image(peach, this.position[0], this.position[1], peach.width * this.scale, peach.height * this.scale);
    } else if (this.char_type == "lakitu") {
      image(lakitu, this.position[0], this.position[1], lakitu.width * this.scale, lakitu.height * this.scale);
    } else if (this.char_type == "subaru") {
      image(subaru, this.position[0], this.position[1], subaru.width * this.scale, subaru.height * this.scale);
    } else if (this.char_type == "audi") {
      image(audi, this.position[0], this.position[1], audi.width * this.scale, audi.height * this.scale);
    }
    // lets RoadObject know to display self driving brackets if self driving mode is on
    if (button_pressed == 1) {
      image(brackets, this.position[0] - 10, this.position[1], brackets.width * this.scale, brackets.height * this.scale);
    }
  }

  // moves car/character to randomly selected position
  move() {
    // console.log(this.target);

    // if bounced to target, move it to another random spot
    if ((int(this.position[0]) <= this.target + 50) && (int(this.position[0]) >= this.target - 50)) {
      // console.log('we made it');
      this.target = this.initial_position[0] + this.movement_arr[int(random(0, 6))];
      
    } else if (int(this.position[0]) < 50 || int(this.position[0]) > 1280) {
        this.target = this.initial_position[0];
        console.log("Initial Position" + str(this.initial_position))
    } else {

      let dx = this.target - this.position[0];
      this.position[0] += dx * this.easing;
    }

  }

}

// toggles moving pics up/down or left/right
let motion_toggle = true;

function preload() {

  // read in looping road mp4 file
  // road_loop = createVideo('road_loop_final.m4v', playVid);
  road_loop = loadImage('road_loop.gif');

  // read in all images
  tesla_dash = loadImage('tesla_dash.png');
  self_drive = loadImage('self_drive.png');
  disengage = loadImage('disengage.png');
  disengage = loadImage('disengage.png');
  rainbow_road = loadImage('rainbow_road.png');
  peach = loadImage('peach.png');
  toad = loadImage('toad.png');
  lakitu = loadImage('lakitu.png');
  subaru = loadImage('subaru.png');
  audi = loadImage('audi.png');

  brackets = loadImage('car_brackets.png');

  // load sound effects
  mariokart_music = loadSound('mariokart.mp3');

}

function setup() {
  let canvas = createCanvas(1280, 855);
  // road_loop.position(0, 0);
  // road_loop.size(1280, 720);
  // canvas.position(0, 0);
  // smooth();
  // serial constructor

  serial = new p5.SerialPort();
  // get a list of all connected serial devices
  serial.list();
  // serial port to use - you'll need to change this
  serial.open('/dev/tty.usbmodem141101');
  // callback for when the sketchs connects to the server
  serial.on('connected', serverConnected);
  // callback to print the list of serial devices
  serial.on('list', gotList);
  // what to do when we get serial data
  serial.on('data', gotData);
  // what to do when there's an error
  serial.on('error', gotError);
  // when to do when the serial port opens
  serial.on('open', gotOpen);
  // what to do when the port closes
  serial.on('close', gotClose);

}

function serverConnected() {
  console.log("Connected to Server");
}

// list the ports
function gotList(thelist) {
  console.log("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    console.log(i + " " + thelist[i]);
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
}

function gotClose() {
  console.log("Serial Port is Closed");
  button_pressed = "Serial Port is Closed";
}

function gotError(theerror) {
  console.log(theerror);
}

// when data is received in the serial buffer

function gotData() {
  let currentString = serial.readLine(); // store the data in a variable
  trim(currentString); // get rid of whitespace
  if (!currentString) return; // if there's nothing in there, ignore it
  console.log(currentString); // print it out
  last_button = button_pressed;
  button_pressed = currentString; // save it to the global variable
}

// define all road/character objects
let toad_obj = new RoadObject("toad", [900, 230], 0.5);
let peach_obj = new RoadObject("peach", [560, 330], 0.3);
let lakitu_obj = new RoadObject("lakitu", [100, 100], 1);
let subaru_obj = new RoadObject("subaru", [560, 330], 0.5);
let audi_obj = new RoadObject("audi", [1100, 300], 0.8);

function draw() {
  
  // playMusic();
  background(255, 255, 255);
  fill(0, 0, 0);
  text(button_pressed, 10, 10); // print the data to the sketch

  button_pressed = 2;
  image(road_loop, 0, 0, road_loop.width/1.5, road_loop.height/1.5);
  road_loop.play();

  if (button_pressed == 0) {
    frames_elapsed = 0;
    // just show the cars
    subaru_obj.show();
    subaru_obj.move();
    audi_obj.show();
    audi_obj.move();
  } else if (button_pressed == 1) {
    frames_elapsed = 0;
    // project self driving HUD
    image(self_drive, 0, 0);
    subaru_obj.show();
    subaru_obj.move();
    audi_obj.show();
    audi_obj.move();

  } else if (button_pressed == 2) {
    // stop self driving
    frames_elapsed++;

    if (frames_elapsed < 200) {
      image(disengage, 0, 0);
    }

    // show the cars
    subaru_obj.show();
    subaru_obj.move();
    audi_obj.show();
    audi_obj.move();
    
  } else if (button_pressed == 3) {
    frames_elapsed = 0;
    
    mariokart_music.play();

    // show rainbow road + characters
    image(rainbow_road, 0, 0);
    peach_obj.move();
    peach_obj.show();
      
    toad_obj.move();
    toad_obj.show();
      
    lakitu_obj.move();
    lakitu_obj.show();

  }

   //overlay Tesla dashboard image
   image(tesla_dash, 0, 0);

}

function playVid() {
  road_loop.loop();
}

function mousePressed() 
{
  if (just_played) {
  	mariokart_music.stop();
  } else {
	  mariokart_music.loop();
  }
  just_played = !just_played;

}

function playMusic () {
  if (button_pressed == 3) {
    mariokart_music.play();
  } else {
    mariokart_music.stop();
  }
}