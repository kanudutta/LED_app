var Gpio = require('onoff').Gpio;
var io = require('socket.io-client');
var socket = io.connect('http://192.168.1.117:8001', {
      reconnect: true
    });

var Beacon = function(name, red_pin, amber_pin, green_pin) {
    this.name = name;
    this.red_pin = red_pin;
    this.amber_pin = amber_pin;
    this.green_pin = green_pin;
    this.green_led = new Gpio(green_pin, 'out');
    this.amber_led = new Gpio(amber_pin, 'out');
    this.red_led = new Gpio(red_pin, 'out');
    this.timer = null;
    this.startTimer();
};

Beacon.prototype.startTimer = function() {
    var that = this;
    this.timer = setTimeout(function() {
        that.red_led.writeSync(0);
        that.amber_led.writeSync(0);
        that.green_led.writeSync(0);
        console.log('LEDs Cleared')
    }, 5000);
};

Beacon.prototype.resetTimer = function() {
    console.log('Reset Timer')
    clearTimeout(this.timer);
    this.startTimer();
};

Beacon.prototype.newScan = function(select_color) {
    console.log('Chosen = ' + select_color);
    if (select_color === 'red') {
        this.red_led.writeSync(1);
        this.amber_led.writeSync(0);
        this.green_led.writeSync(0);
    } else if ( select_color === 'green' ) {
        this.red_led.writeSync(0);
        this.amber_led.writeSync(0);
        this.green_led.writeSync(1);
    } else if ( select_color === 'amber' ) {
        this.red_led.writeSync(0);
        this.amber_led.writeSync(1);
        this.green_led.writeSync(0);
    }
    this.resetTimer();
};

console.log('2');
var beacon1_id = new Beacon("lounge", 7, 8, 25);

// Add a connect listener
socket.on('connect', function(socketc) { 
  console.log('Connected!');

  socket.on('lightR', function(data){
    // process.stdout.write(data);
    console.log('light status');
    console.log(data);
    beacon1_id.newScan(data);
  });
});
