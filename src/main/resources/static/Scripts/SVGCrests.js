//Basic Shield
var crest1 = '<svg width="580" height="400" xmlns="http://www.w3.org/2000/svg">';
crest1 += '<defs></defs>';
crest1 += '<path class="svg-crest" fill="none" stroke="black" stroke-width="1.5" stroke-opacity="null" fill-opacity="null" d="m1,1l132.99994,0l0,126.39998l-66.50001,31.60003l-66.5,-31.60003l0.00008,-126.39998l-0.00001,0z" id="crest-1"/>';
crest1 += '</svg>';

//Circle Shield
var crest2 = '<svg width="580" height="400" xmlns="http://www.w3.org/2000/svg">';
crest2 += '<defs></defs>';
crest2 += '<ellipse class="svg-crest" fill="none" stroke-width="1.5" stroke-opacity="null" fill-opacity="null" cx="70" cy="70" id="svg_9" rx="69" ry="69" stroke="black" id="crest-2"/>';
crest2 += '</svg>';

//Curved Shield
var crest3 = '<svg width="580" height="400" xmlns="http://www.w3.org/2000/svg">';
crest3 += '<defs></defs>';
crest3 += '<path class="svg-crest" stroke-width="1.5" d="m10,1c33,10 99,10 132,0c10,10 30,50 -66,150m-66,-150c-10,10 -30,50 66,150" fill="transparent" id="svg_2" stroke="black" id="crest-3"/>';
crest3 += '</svg>';

//Curved Bottom Shield
var crest4 = '<svg width="580" height="400" xmlns="http://www.w3.org/2000/svg">';
crest4 += '<defs></defs>';
crest4 += '<path class="svg-crest" stroke="black" id="crest-4" d="m1,1l130,0l0,113.72727c-19.5,25.27273 -39,-12.63636 -65,25.27273c-26,-37.90909 -45.5,0 -65,-25.27273l0,-113.72727" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" fill="transparent"/>';
crest4 += '</svg>';


function crestFromValue(crestType) {
	if(crestType == 1) {
		return crest1;
	}
	else if(crestType == 2) {
		return crest2;
	}
	else if(crestType == 3) {
		return crest3;
	}
	else {
		return crest4;
	}
}

function drawCrestStyle() {
	$('.current-svg').removeClass('current-svg');
	$('#crest-design-container').empty();
	var svg = crestFromValue($('#crest-style-id').text());
	$('#crest-design-container').append(svg);
	$('#crest-design-container svg').addClass('current-svg');
	var scale = $('#crest-design-container').height() / $('.svg-crest').height();
	$('.current-svg .svg-crest').attr('transform', 'scale(' + scale + ')');
	$('.current-svg').width($('.svg-crest').width() + 10);
	$('.current-svg').height($('.svg-crest').height() + 10);
}

function drawCrestStyleCustom(containerDom, crestStyle) {
	$('.current-svg').removeClass('current-svg');
	$(containerDom).empty();
	var svg = crestFromValue(crestStyle);
	$(containerDom).append(svg);
	$(containerDom + ' svg').addClass('current-svg');
	var scale = $(containerDom).height() / $('.current-svg .svg-crest').height();
	$('.current-svg .svg-crest').attr('transform', 'scale(' + scale + ')');
	$('.current-svg').width($('.current-svg .svg-crest').width() + 10);
	$('.current-svg').height($('.current-svg .svg-crest').height() + 10);
}

function drawCrestDesign() {
	var design = $('#crest-design-id').text();
	var pR = $('#primary-red').val();
	var pG = $('#primary-green').val(); 
	var pB = $('#primary-blue').val();
	var sR = $('#secondary-red').val();
	var sG = $('#secondary-green').val(); 
	var sB = $('#secondary-blue').val();
	drawCrestDesignCustom(design, pR, pG, pB, sR, sG, sB, 'Gradient1');
}

function drawCrestDesignCustom(design, pR, pG, pB, sR, sG, sB, GradName){
	$('.current-svg defs').empty();	
	if(design == 1) {
		$('.current-svg .svg-crest').attr('fill', 'rgb(' + pR + ', ' + pG + ', ' + pB + ')');
	}
	if(design == 2) {
		createLinearGradient($('.current-svg')[0],GradName, [
  			{offset:'0%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%', 'stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%','stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 135, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName +')');
	}
	if(design == 3) {
		createLinearGradient($('.current-svg')[0],GradName, [
  			{offset:'0%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%', 'stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%','stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 45, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	if(design == 4) {
		createLinearGradient($('.current-svg')[0],GradName, [
  			{offset:'0%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%', 'stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%','stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 0, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	if(design == 5) {
		createLinearGradient($('.current-svg')[0],GradName, [
  			{offset:'0%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'35%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%', 'stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'65%','stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 90, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 6) {
		createRadialGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'45%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'45%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			]);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 7) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 0, true);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 8) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 90, true);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 9) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 135, true);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 10) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 45, true);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 11) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 90, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 12) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 0, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 13) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 135, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
	
	if(design == 14) {
		createLinearGradient($('.current-svg')[0],GradName, [
			{offset:'0%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%','stop-color':'rgb(' + sR + ', ' + sG + ', ' + sB + ')'},
  			{offset:'50%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
  			{offset:'100%', 'stop-color':'rgb(' + pR + ', ' + pG + ', ' + pB + ')'},
			], 45, false);
		$('.current-svg .svg-crest').attr('fill', 'url(#' + GradName + ')');
	}
}

function createLinearGradient(svg, id, stops, rotation, repeat) {
	var svgNS = svg.namespaceURI;
  	var grad  = document.createElementNS(svgNS,'linearGradient');
  	var xVal = 0.5;
  	var yVal = 0.5;
 	grad.setAttribute('id',id);
 	grad.setAttribute('gradientTransform', 'rotate(' + rotation + ' ' + xVal + ' ' + yVal + ')');
 	if(repeat) {
 		grad.setAttribute('spreadMethod', 'repeat');
 		grad.setAttribute('x1', '0%');
 		grad.setAttribute('x2', '18.18%');
 		grad.setAttribute('y1', '0%');
 		grad.setAttribute('y2', '0%');
 	}
  	for (var i=0;i<stops.length;i++){
    	var attrs = stops[i];
    	var stop = document.createElementNS(svgNS,'stop');
   	 	for (var attr in attrs){
      		if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
    	}
    	grad.appendChild(stop);
  	}

  	var defs = svg.querySelector('defs') ||
      svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);
  	return defs.appendChild(grad);
}

function createRadialGradient(svg, id, stops) {
	var svgNS = svg.namespaceURI;
  	var grad  = document.createElementNS(svgNS,'radialGradient');
  	var xVal = 0.5;
  	var yVal = 0.5;
 	grad.setAttribute('id',id);
 	grad.setAttribute('cX',xVal);
 	grad.setAttribute('cY',yVal);
  	for (var i=0;i<stops.length;i++){
    	var attrs = stops[i];
    	var stop = document.createElementNS(svgNS,'stop');
   	 	for (var attr in attrs){
      		if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
    	}
    	grad.appendChild(stop);
  	}

  	var defs = svg.querySelector('defs') ||
      svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);
  	return defs.appendChild(grad);
}