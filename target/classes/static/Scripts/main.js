// On Load
$(document).ready(function() {
	$('.overlay').hide();
	
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/GenSim/load',
		headers: {
        	"Accept": "application/json",
        	"Content-Type": "application/json"
    	},
    	success: function() {
    	},
    	error: function() {
    		console.log("ERROR");
    	}
	});
});

// Pressing Main Buttons
$('#dyn-selector').click(function() {
	$('#dyn-selector-overlay').show();
	$('#dyn-creator-overlay').hide();
	$('#mem-info-overlay').hide();
	$('#search-table-body').empty();
	selectDynasty();
});

$('#dyn-creator').click(function() {
	if($('#dyn-creator-overlay').css('display') == 'none') {
		founder = null;
	}
	$('#dyn-creator-overlay').show();
	$('#dyn-selector-overlay').hide();
	$('#mem-info-overlay').hide();
	$('.founder-display').hide();
	drawCrestStyleCustom('#crest-design-container', $('#crest-style-id').text());
	drawCrestDesign();
});

$('.close').click(function() {
	if($(this).parent().parent().attr('id') == 'dyn-creator-overlay') {
		clearInputs();
	}
	$(this).parent().parent().hide();
});