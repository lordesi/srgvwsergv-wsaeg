var lightblue= '#34dff5';
var darkblue= '#004e63';
var lightgreen= '#7ae93d';
var darkgreen= '#355723';
var pink= '#e93578';

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
    this.radius = {'outerR': 155, 'innerR': 117},
    this.frontcircle = {'endA': Math.PI * 2 * this.minutes/ this.totalMins, color: lightblue },
    this.backcircle = {'endA': Math.PI * 2, color: darkblue }
};

var _break = new function() {
  this.totalMins = 30,
    this.minutes = 5,
    this.startime = undefined,
    this.elapsed = 0,
    this.run = false,
    this.radius = {'outerR': 109, 'innerR': 71},
    this.frontcircle = {'endA': Math.PI * 2 * this.minutes/ this.totalMins, color: lightgreen},
    this.backcircle = {'endA': Math.PI * 2, color: darkgreen}
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

var sliderHandlePomodoro = sliderPomodoro.append("div")
    .attr("class", "slider-handle");

var sliderHandleBreak = sliderBreak.append("div")
    .attr("class", "slider-handle");

sliderHandlePomodoro.append("div")
    .attr("class", "slider-handle-icon")
    .style('background-color', pomodoro.frontcircle.color);

sliderHandlePomodoro
    .style("left", xPomodoro(pomodoro.minutes) + "px");

sliderHandleBreak.append("div")
    .attr("class", "slider-handle-icon")
    .style('background-color', _break.frontcircle.color);

sliderHandleBreak
    .style("left", xBreak(_break.minutes) + "px");


////texts
var textcanvas = d3.select('.text')
  .append('svg')
  .attr('width', width)
  .attr('height', 80);

var textPomodoro = textcanvas.append("text")
  .attr('text-anchor', 'middle')
  .attr("x", width/3)
  .attr("y", 70)
  .text(pomodoro.minutes)
  .attr("font-family", "Delius")
  .attr("font-size", "60px")
  .attr('fill-opacity', '1')
  .attr("fill", pomodoro.frontcircle.color)
  .attr('id', 'textPomodoro');

var textPomWidth = document.getElementById("textPomodoro").getBBox().width;

var pomPoint = textcanvas.append('circle')
  .attr('cx', (width/3) + (textPomWidth/2) + 5)
  .attr('cy', 67)
  .attr('r', 3)
  .attr('fill', pomodoro.frontcircle.color)
  .attr('fill-opacity', '1');

var textBreak = textcanvas.append("text")
  .attr('text-anchor', 'middle')
  .attr("x", width*2/3)
  .attr("y", 70)
  .text(_break.minutes)
  .attr("font-family", "Delius")
  .attr("font-size", "60px")
  .attr("fill", _break.frontcircle.color)
  .attr('id', 'textBreak');

var textBreakWidth = document.getElementById("textBreak").getBBox().width;

var breakPoint = textcanvas.append('circle')
  .attr('cx', (width*2/3) + (textBreakWidth/2) + 5)
  .attr('cy', 67)
  .attr('r', 3)
  .attr('fill', _break.frontcircle.color)
  .attr('fill-opacity', '1');

function displayPom(val){
  textPomodoro.text(val);
}

function displayBreak(val){
  textBreak.text(val);
}

///// Dispatch calls
sliderPomodoro.call(d3.drag()
    .on("start", function() {
      dispatchPomodoro.call('sliderChange',  this , ( xPomodoro.invert(d3.mouse(sliderTrayPomodoro.node())[0])));
      d3.event.sourceEvent.preventDefault();
    })
    .on("drag", function() {
      dispatchPomodoro.call('sliderChange', this, (xPomodoro.invert(d3.mouse(sliderTrayPomodoro.node())[0])));
    }));

sliderBreak.call(d3.drag()
    .on("start", function() {
      dispatchBreak.call('sliderChange',  this , ( xBreak.invert(d3.mouse(sliderTrayBreak.node())[0])));
      d3.event.sourceEvent.preventDefault();
    })
    .on("drag", function() {
      dispatchBreak.call('sliderChange', this, (xBreak.invert(d3.mouse(sliderTrayBreak.node())[0])));
    }));

dispatchPomodoro.on("sliderChange.slider", function(event) {
  pomodoro.minutes = parseInt(event);  
  displayPom(pomodoro.minutes);
  pomPoint.attr('cx', (width/3)+(document.getElementById("textPomodoro").getBBox().width/2)+5);
  pomodoro.frontcircle.endA =  Math.PI * 2 * parseInt(event)/ pomodoro.totalMins; 
  sliderHandlePomodoro.style("left", xPomodoro(event) + "px");
  frontArcs = group.selectAll('.frontArcs')
  .data(data)
  .attr('d', frontarc);   
});

dispatchBreak.on("sliderChange.slider", function(event) {
  _break.minutes = parseInt(event);
  //console.log('_break.minutes', parseInt(event));
  displayBreak(_break.minutes);
  breakPoint.attr('cx', (width*2/3)+(document.getElementById("textBreak").getBBox().width/2)+5);
  _break.frontcircle.endA =  Math.PI * 2 * parseInt(event)/ _break.totalMins; 
  //console.log('_break.frontcircle.endA', _break.frontcircle.endA);
  sliderHandleBreak.style("left", xBreak(event) + "px");
  frontArcs = group.selectAll('.frontArcs')
  .data(data)
  .attr('d', frontarc);
  
  })

//// Display circular elements
var canvas = d3.select('.svg')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

var group = canvas.append('g')
  .attr('transform', 'translate('+ width/2 +', '+ height/2 +')');

/// First draw Back arcs
var backarc = d3.arc()
  .outerRadius(function(d){ return d.radius.outerR; })
  .innerRadius(function(d){ return d.radius.innerR; })
  .startAngle(0)
  .endAngle(function(d){ return d.backcircle.endA; })
  .cornerRadius([20]);

var backArcs = group.selectAll('.backArcs')
  .data(data)
  .enter().append('path')
  .attr('fill', function(d){ return d.backcircle.color; }) 
  .attr('class', 'backArcs')
  .attr('d', backarc);

/// Front arcs
var frontarc = d3.arc()
  .outerRadius(function(d){ return d.radius.outerR; })
  .innerRadius(function(d){ return d.radius.innerR; })
  .startAngle(0)
  .endAngle(function(d){ return d.frontcircle.endA; })
  .cornerRadius([20]);

var frontArcs = group.selectAll('.frontArcs')
  .data(data)
  .enter().append('path')
  .attr('fill', function(d){ return d.frontcircle.color; }) 
  .attr('class', 'frontArcs')
  .attr('d', frontarc);

/// Play button
var play = canvas.append('g')
  .attr('transform', 'translate('+ width/2 +', '+ height/2 +')')
  .on("mouseover", mouseover)
  .on("mouseout", mouseout)
  .on("click", click);

play.append('circle')
  .attr('fill', pink)
  .attr('r', 63);
  
play.append('circle')
  .attr('fill', 'black')
  .attr('fill-opacity', '0.7')
  .attr('r', 53)
  .attr('class', 'buttonbackground');

play.append('polygon')
  .attr('fill', pink)
  .attr('points', '-11,-21 23,0 -11,21')
  .attr('visibility', 'visible')
  .attr('class', 'play');

play.append('polygon')
  .attr('fill', pink)
  .attr('points', '5,20 5,-20 19,-20 19,20')
  .attr('visibility', 'hidden')
  .attr('class', 'pause');

play.append('polygon')
  .attr('fill', pink)
  .attr('points', '-19,20 -19,-20 -5,-20 -5,20')
  .attr('visibility', 'hidden')
  .attr('class', 'pause');

function mouseover() {
  d3.select('.buttonbackground')
    .transition()
      .duration(100)
      .attr('fill-opacity', '0.5');
}

function mouseout() {
  d3.select('.buttonbackground')
    .transition()
      .duration(100)
      .attr('fill-opacity', '0.7');
}

//// Timers
var timeElapsed = 0;

var t = d3.timer(myfunction);
  
function myfunction(elapsed) {
  if(play===true){
    if(pomodoro.run === true){
      if (pomodoro.startTime == undefined)
        pomodoro.startTime = elapsed/1000/60; 

      var pomodoro_elapsed = elapsed/1000/60 - pomodoro.startTime; 
      var pomodoro_left = pomodoro.minutes - pomodoro_elapsed;
      
      displayPom(parseInt(pomodoro_left)+1);
      pomodoro.frontcircle.endA = Math.PI * 2 * pomodoro_left/ pomodoro.totalMins; 
      textPomodoro.attr("fill", pomodoro.frontcircle.color);
      pomPoint.attr("fill", pomodoro.frontcircle.color);
      textBreak.attr("fill", _break.backcircle.color);
      breakPoint.attr("fill", _break.backcircle.color);

      frontArcs = group.selectAll('.frontArcs')
        .data(data)
        .attr('d', frontarc);

      if(pomodoro_elapsed>= pomodoro.minutes){
        audio.play();
        pomodoro.startTime = undefined;
        pomodoro.run = false;
        _break.run = true;
        pomodoro.frontcircle.endA = Math.PI * 2 * pomodoro.minutes/ pomodoro.totalMins; 
        displayPom(parseInt(pomodoro.minutes));
      }
    }

    if(_break.run === true){
      if (_break.startTime == undefined)
        _break.startTime = elapsed/1000/60;
        
      var break_elapsed = elapsed/1000/60 - _break.startTime;
      var break_left = _break.minutes - break_elapsed;

      displayBreak(parseInt(break_left)+1);
      _break.frontcircle.endA = Math.PI * 2 * break_left/ _break.totalMins;
      textBreak.attr("fill", _break.frontcircle.color);
      breakPoint.attr("fill", _break.frontcircle.color);
      textPomodoro.attr("fill", pomodoro.backcircle.color);
      pomPoint.attr("fill", pomodoro.backcircle.color);

      frontArcs = group.selectAll('.frontArcs')
        .data(data)
        .attr('d', frontarc);
      
      if(break_elapsed>= _break.minutes){
        audio.play();
        _break.startTime = undefined;
        _break.run = false;
        pomodoro.run = true;
        _break.frontcircle.endA = Math.PI * 2 * _break.minutes/ _break.totalMins;
        displayBreak(parseInt(_break.minutes));
      }
    }
  }
}

function pomSec(){
  if(pomodoro.run === true){
    pomPoint
      .transition()
      .duration(500)
      .attr('fill-opacity', '0')
      .transition()
      .duration(50)
      .attr('fill-opacity', '1');
  }
}

function breakSec(){
  if(_break.run === true){
    breakPoint
      .transition()
      .duration(500)
      .attr('fill-opacity', '0')
      .transition()
      .duration(50)
      .attr('fill-opacity', '1');
  }
}

// The click button don't stop the timer, 
// just set play to true or false to indicate that minutes display and the arcs should start 'moving':
var pomInterval;
var breakInterval;
function click() {
  
  if(play === true){
    console.log('stop');
    clearInterval(pomInterval);
    clearInterval(breakInterval);
    play = false;
    d3.select('.play')
      .attr('visibility', 'visible');
    d3.selectAll('.pause')
      .attr('visibility', 'hidden');

  } else {
    console.log('play');
    pomSec();
    breakSec();
    pomInterval = setInterval(pomSec, 1000);
    breakInterval = setInterval(breakSec, 1000);
    play = true;
    d3.select('.play')
      .attr('visibility', 'hidden');
    d3.selectAll('.pause')
      .attr('visibility', 'visible');
   
  } 
}



