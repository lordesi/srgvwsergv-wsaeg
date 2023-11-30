var lightblue = '#34dff5';
var darkblue = '#004e63';
var lightgreen = '#7ae93d';
var darkgreen = '#355723';
var pink = '#e93578';
var lightpurple = '#934dff';
var darkpurple = '#3c004e';

var width = 320;
var height = 320;
var sliderWidth = 310;
var play = false;

var wav = 'https://raw.githubusercontent.com/mi-mina/freecodecamp/master/Advanced-front-end/alarm01.mp3';
var audio = new Audio(wav);

var pomodoro = new function() {
  this.totalMins = 120,
    this.minutes = 25,
    this.startime = undefined,
    this.elapsed = 0,
    this.run = true,
    this.radius = { 'outerR': 155, 'innerR': 117 },
    this.frontcircle = { 'endA': Math.PI * 2 * this.minutes / this.totalMins, color: lightblue },
    this.backcircle = { 'endA': Math.PI * 2, color: darkblue }
};

var _break = new function() {
  this.totalMins = 30,
    this.minutes = 5,
    this.startime = undefined,
    this.elapsed = 0,
    this.run = false,
    this.radius = { 'outerR': 109, 'innerR': 71 },
    this.frontcircle = { 'endA': Math.PI * 2 * this.minutes / this.totalMins, color: lightgreen },
    this.backcircle = { 'endA': Math.PI * 2, color: darkgreen }
};

var data = [pomodoro, _break];

/// Scales
var xPomodoro = d3.scaleLinear()
  .domain([1, pomodoro.totalMins])
  .range([0, sliderWidth])
  .clamp(true);

var xBreak = d3.scaleLinear()
  .domain([1, _break.totalMins])
  .range([0, sliderWidth])
  .clamp(true);

/// Dispatches and sliders 
var dispatchPomodoro = d3.dispatch("sliderChange");
var dispatchBreak = d3.dispatch("sliderChange");

var sliderPomodoro = d3.select(".sliderPomodoro")
  .style("width", sliderWidth + "px");

var sliderBreak = d3.select(".sliderBreak")
  .style("width", sliderWidth + "px");

var sliderTrayPomodoro = sliderPomodoro.append("div")
  .attr("class", "slider-tray")
  .style('background-color', pomodoro.frontcircle.color);

var sliderTrayBreak = sliderBreak.append("div")
  .attr("class", "slider-tray")
  .style('background-color', _break.frontcircle.color);

// ... (Continua con il codice relativo agli slider e al resto delle parti invariate)

var textPomodoro = textcanvas.append("text")
  .attr('text-anchor', 'middle')
  .attr("x", width / 3)
  .attr("y", 70)
  .text(formatTime(pomodoro.minutes * 60))
  .attr("font-family", "Arial")
  .attr("font-size", "60px")
  .attr('fill-opacity', '1')
  .attr("fill", lightpurple)
  .attr('id', 'textPomodoro');

// ... (Codice simile per textBreak)

function formatTime(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

function displayPom(val) {
  textPomodoro.text(formatTime(val * 60));
}

function displayBreak(val) {
  textBreak.text(formatTime(val * 60));
}

// ... (Resto del codice invariato)

function click() {
  if (play === true) {
    clearInterval(pomInterval);
    clearInterval(breakInterval);
    play = false;
    d3.select('.play').attr('visibility', 'visible');
    d3.selectAll('.pause').attr('visibility', 'hidden');
  } else {
    pomInterval = setInterval(function () {
      pomodoro.minutes--;
      displayPom(pomodoro.minutes);
      if (pomodoro.minutes === 0) {
        clearInterval(pomInterval);
        breakInterval = setInterval(function () {
          _break.minutes--;
          displayBreak(_break.minutes);
          if (_break.minutes === 0) {
            clearInterval(breakInterval);
          }
        }, 1000);
      }
    }, 1000);

    play = true;
    d3.select('.play').attr('visibility', 'hidden');
    d3.selectAll('.pause').attr('visibility', 'visible');
  }
}
