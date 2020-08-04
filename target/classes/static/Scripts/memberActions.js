var currentChild = null;

$(document).on('click', '.marryBtn', function() {
	var id = $(this).attr('id').split('-')[1];
	var sex = $(this).attr('id').split('-')[2];
	var slider = '<div class="incest-threshold-header">Incest Threshold: </div>';
	slider += '<input type="range" min="0" max="8" value="4" class="slider incest-threshold" id="incest-threshold-slider-' + id + '-' + sex + '">';
    slider += '<span class="value-display" id="incest-threshold-value">4</span>';
    if(popupDisplay) {
    	 $('.mem-opt-popup').append(slider);
    }
    else {
    	$('.marryOptionsPopup').remove();
    	createMarryPopup();
    	$('.marryOptionsPopup').append(slider);
    }
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/GenSim/marriage-options/' + id + '/' + $('.incest-threshold').val(),
		headers: {
        	"Accept": "application/json",
        	"Content-Type": "application/json"
    	},
    	success: function(options) {
    		$('.marriage-opt-btn-popup').remove();
    		displayMarriageOptions(options, id, sex);
    	},
    	error: function(response) {
    		console.log(response);
    	}
	});
});

function createMarryPopup() {
	var popup = "<div class='marryOptionsPopup' id='marriage-popup-member-display'></div>";
	$('body').append(popup);
	$('.marryOptionsPopup').css("top", $('.marryBtn').position().top + $('.marryBtn').height() + 30);
	$('.marryOptionsPopup').css("left", $('.marryBtn').position().left + $('.marryBtn').width() + 300);
}

$(document).on('input', '.incest-threshold', function() {
	var id = $(this).attr('id').split('-')[3];
	var sex = $(this).attr('id').split('-')[4];
	$('.value-display').text($('.incest-threshold').val());
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/GenSim/marriage-options/' + id + '/' + $('.incest-threshold').val(),
		headers: {
        	"Accept": "application/json",
        	"Content-Type": "application/json"
    	},
    	success: function(options) {
    		$('.marriage-opt-btn-popup').remove();
    		displayMarriageOptions(options, id, sex);
    	},
    	error: function(response) {
    		console.log(response);
    	}
	});
});

$(document).on('click', '.childBtn', function() {
	var id = $(this).attr('id').split('-')[1];
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/GenSim/have-child/' + id,
		headers: {
        	"Accept": "application/json",
        	"Content-Type": "application/json"
    	},
    	success: function(child) {
    		currentChild = child;
    		nameChild(child);
    	},
    	error: function(response) {
    		console.log(response);
    	}
	});
});

function displayMarriageOptions(options, id, sex) {
	var limitL = 800;
	var limitT = 500;
	$.each(options, function(index, option) {
		var optionBtn = "";
		if(sex == 'Female') {
			optionBtn = "<button class='marriage-opt-btn marriage-opt-btn-popup marriageBtn btn' id='marriageBtn-" + option.memberId + "-" + id + "'>" + option.name + " " + option.primaryDynasty.name + "</button>";
		}
		else {
			optionBtn = "<button class='marriage-opt-btn marriage-opt-btn-popup marriageBtn btn' id='marriageBtn-" + id + "-" + option.memberId + "'>" + option.name + " " + option.primaryDynasty.name + "</button>";
		}
		if(popupDisplay) {
			$('.mem-opt-popup').append(optionBtn);
		}	
		else {
			$('.marryOptionsPopup').append(optionBtn);
		}
	});
	if(!popupDisplay) {
		popupDisplay = true;
	}
}

$(document).on('click', '.marriageBtn', function() {
	$('.selected-marriageBtn').removeClass('selected-marriageBtn');
	$(this).addClass('selected-marriageBtn');
	var limitL = 800;
	var matrilinealSelect = "<div class='matrilinealSelect' id='matrilinealSelectBox'>";
	matrilinealSelect += "<button class='matrilinealSelectBtn btn' id='matrilinealBtn'>Matrilineal</button>";
	matrilinealSelect += "<button class='matrilinealSelectBtn btn' id='patrilinealBtn'>Patrilineal</button>";
	matrilinealSelect += "</div>";
	$('body').append(matrilinealSelect);
	if($('.mem-opt-popup').is(':visible')) {
		$('.matrilinealSelect').css("top", $('.mem-opt-popup').position().top);
		if($('.mem-opt-popup').position().left + $('.mem-opt-popup').width() > limitL) {
			$('.matrilinealSelect').css("left", $('.mem-opt-popup').position().left - $('.matrilinealSelect').width() - 7);
		}
		else {
			$('.matrilinealSelect').css("left", $('.mem-opt-popup').position().left + $('.mem-opt-popup').width() + 7);
		}
	}
	else {
		$('.matrilinealSelect').css("top", $('.marryOptionsPopup').position().top);
		$('.matrilinealSelect').css("left", $('.marryOptionsPopup').position().left + $('.marryOptionsPopup').width() + 7);
	}
});

$(document).on('click', '.matrilinealSelectBtn', function() {
	var femaleId = $('.selected-marriageBtn').attr('id').split('-')[2];
	var maleId = $('.selected-marriageBtn').attr('id').split('-')[1];
	var mat = true;
	if($(this).attr('id') == 'patrilinealBtn') {
		mat = false;
	}
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/GenSim/arrange-marriage/' + maleId + '/' + femaleId,
		headers: {
     	 	"Accept": "application/json",
      	 	"Content-Type": "application/json"
    	},
    	data: JSON.stringify(mat),
    	success: function() {
    		if(popupDisplay) {
    			$('.mem-opt-popup').empty();
    			$('.mem-opt-popup').remove();
    			$('.matrilinealSelect').empty();
    			$('.matrilinealSelect').remove();
    			popupDisplay = false;
    			updateDynastyDisplay(currentDynasty);
    		}
    	},
    	error: function() {
    		console.log("ERROR");
    	}
	});
});

function nameChild(child) {
	$('.name-input-popup').remove();
	var limitL = 800;
	var domIn = "<div class='popup name-input-popup' id='child-name-popup'>";
	domIn += "<div id='child-gender-reveal'>Name the new " + child.traits.Sex.value + "</div>";
	domIn += "<label for='child-name-input'>Name: </label>";
	domIn += "<input type='text' class='name-input-popup-text' id='child-name-input' minlength='1' maxlength='30' size='20'>";
	domIn += "<button class='btn submit-name-btn invalid-name-entry' id='submit-child-name-popup'>OK</button>";
	if(child.traits.Sex.value == 'Male') {
		domIn += "<button class='btn submit-name-btn gen-rand-name' id='gen-child-name-male'>Generate Random</button>";
	}
	else {
		domIn += "<button class='btn submit-name-btn gen-rand-name' id='gen-child-name-female'>Generate Random</button>";
	}
	domIn += "</div>";
	$('body').append(domIn);
	$('.name-input-popup').css("top", $('.mem-opt-popup').position().top);
	if($('.mem-opt-popup').position().left + $('.mem-opt-popup').width() > limitL) {
		$('.name-input-popup').css("left", $('.mem-opt-popup').position().left - $('.name-input-popup').width() - 7);
	}
	else {
		$('.name-input-popup').css("left", $('.mem-opt-popup').position().left + $('.mem-opt-popup').width() + 7);
	}
}

$(document).on('click', '.gen-rand-name', function() {
	var sex = $('.gen-rand-name').attr('id').split('-')[3];
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/GenSim/get-random-name',
		headers: {
     	 	"Accept": "application/json",
      	 	"Content-Type": "application/json"
    	},
    	data: sex,
    	success: function(member) {
    		$('.name-input-popup-text').val(member.name);
    	},
    	error: function(response) {
    		console.log(response);
    	}
	});
});

$(document).on('input', '#child-name-input', function() {
	checkIfNameValid();
});

function checkIfNameValid() {
	var name = $('.name-input-popup-text').val();
	if(name != null && name.length >= 1 && name.length <= 30) {
		$('.invalid-name-entry').removeClass('invalid-name-entry');
	}
	else {
		if(!$('#submit-child-name-popup').hasClass('invalid-name-entry')) {
			$('#submit-child-name-popup').addClass('invalid-name-entry');
		}
	}
}

$(document).on({
    mouseenter: function () {
    	checkIfNameValid();
    	if($('#submit-child-name-popup').hasClass('invalid-name-entry')) {
        	$('#submit-child-name-popup').css('border-color', 'red');
			$('#submit-child-name-popup').css('color', 'red');
		}
    },
    mouseleave: function () {
        $('#submit-child-name-popup').css('border-color', 'slategrey');
		$('#submit-child-name-popup').css('color', 'black');
    }
}, '#submit-child-name-popup');

$(document).on('click', '#submit-child-name-popup', function() {
	checkIfNameValid();
	if(!$('#submit-child-name-popup').hasClass('invalid-name-entry')) {
		var name = $('.name-input-popup-text').val();
		currentChild.name = name;
		$('.popup').hide();
		saveChild(currentChild);
	}
});

function saveChild(child) {
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/GenSim/save-child',
		headers: {
     	 	"Accept": "application/json",
      	 	"Content-Type": "application/json"
    	},
    	data: JSON.stringify(child),
    	success: function() {
    		updateDynastyDisplay(currentDynasty);
    	},
    	error: function() {
    		console.log("ERROR");
    	}
	});
}

function updateDynastyDisplay(currentDynasty) {
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/GenSim/update-dynasty-display',
		headers: {
     	 	"Accept": "application/json",
      	 	"Content-Type": "application/json"
    	},
    	data: JSON.stringify(currentDynasty),
    	success: function(dynasty) {
    		displayDynastyMain(dynasty);
    	},
    	error: function(response) {
    		console.log(response);
    	}
	});
}