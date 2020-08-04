// Crest Creation
var crestDesignMax = 14;
var crestStyleMax = 4;
var crestDesignId = 1;
var crestStyleId = 1;

$('#crest-style-down').click(function() {
	if(crestStyleId == 1) {
		crestStyleId = crestStyleMax;
	}
	else {
		crestStyleId = crestStyleId - 1;
	}
	$('#crest-style-id').text(crestStyleId);
});

$('#crest-style-up').click(function() {
	crestStyleId = (crestStyleId % crestStyleMax) + 1;
	$('#crest-style-id').text(crestStyleId);
});

$('#crest-design-down').click(function() {
	if(crestDesignId == 1) {
		crestDesignId = crestDesignMax;
	}
	else {
		crestDesignId = crestDesignId - 1;
	}
	$('#crest-design-id').text(crestDesignId);
});

$('#crest-design-up').click(function() {
	crestDesignId = (crestDesignId % crestDesignMax) + 1;
	$('#crest-design-id').text(crestDesignId);
});

// Founder Creation
var founder = null;
var founderTraits = null;

$('#custom-founder').click(function() {
	$('#founder-create-edit-view-overlay').show();
	$('#founder-interface-body').empty();
	if(founderTraits == null) {
		$.ajax({
			type: 'GET',
			url: 'http://localhost:8080/GenSim/get-all-traits',
			headers: {
        		"Accept": "application/json",
        		"Content-Type": "application/json"
    		},
    		success: function(traitsList) {
    			founderTraits = traitsList;
    			setupFounderCreationPopup();
    		},
    		error: function(response) {
    			console.log(response);
    		}
		});
	}
	else {
		setupFounderCreationPopup();
	}
});

$('#edit-founder-btn').click(function() {
	$('#founder-create-edit-view-overlay').show();
	$('#founder-interface-body').empty();
	if(founderTraits == null) {
		$.ajax({
			type: 'GET',
			url: 'http://localhost:8080/GenSim/get-all-traits',
			headers: {
        		"Accept": "application/json",
        		"Content-Type": "application/json"
    		},
    		success: function(traitsList) {
    			founderTraits = traitsList;
    			setupFounderCreationPopup();
    		},
    		error: function(response) {
    			console.log(response);
    		}
		});
	}
	else {
		setupFounderCreationPopup();
	}
});

function setupFounderCreationPopup() {
	var edit = false;
	if(founder != null) {
		edit = true;
		$('#dyn-founder-name-input').val(founder.name);
	}
	$.each(founderTraits, function(index, trait) {
    	var traitName = trait.name;
    	traitName = traitName.replace(/\s/g, '');
    	var traitRow = '<div class="row trait-customization" id="trait-row-' + traitName + '">';
    	traitRow += '<label class="trait-label" id="trait-name-label" for="trait-name-' + traitName + '"> Trait: </label>';
    	traitRow += '<span class="trait-name" id="trait-name-' + traitName + '">' + trait.name + '</span>';
    	traitRow += '<label class="trait-label" id="trait-value-label" for="trait-value-' + traitName + '"> Value: </label>';
    	traitRow += '<select class="trait-value" id="trait-value-' + traitName + '"></select>';
    	traitRow += '<label class="trait-label" id="trait-valuePool-label" for="trait-valuePool-' + traitName + '"> Value Pool: </label>';
    	for(var i = 1; i <= 4; i++) {
    		traitRow += '<select class="trait-valuePool" id="trait-valuePool-' + traitName + '-' + i + '" data-values="' + trait.values + '">';
    		$.each(trait.values, function(index, value) {
    			traitRow += '<option value="' + value + '">' + value + '</option>';
    		});
    		traitRow += '</select>';
    	}
    	traitRow += '</div>';
    	traitRow += '<hr>';
		$('#founder-interface-body').append(traitRow);
		if(edit) {
			selectValuePoolForEdit(trait);
		}
    	var valOpt = '';
    	$.each(getPossibleValues(trait, traitName), function(index, value) {
    		valOpt += '<option value="' + value + '">' + value + '</option>';
    	});
    	$('#trait-value-' + traitName).append(valOpt);
    	if(edit) {
    		selectValueForEdit(trait);
    	}
    });
    var btns;
    if(!edit) {
    	btns = '<button class="btn cancel-btn custom-founder-exit-btn" id="cancel-founder-btn">Cancel</button><button class="btn create-founder custom-founder-exit-btn invalid-founder" id="create-founder-btn">Create</button>';
    }
    else {
    	btns = '<button class="btn cancel-btn custom-founder-exit-btn" id="cancel-founder-btn">Cancel</button><button class="btn create-founder custom-founder-exit-btn" id="create-founder-btn">Create</button>';
    }
    $('#founder-interface-body').append(btns);
}

function selectValuePoolForEdit(trait) {
	var traitName = trait.name;
    traitName = traitName.replace(/\s/g, '');
	for(var i = 1; i <= 4; i++) {
		var value = founder.traits[trait.name].valuePool[i-1];
		$('#trait-valuePool-' + traitName + '-' + i + ' option[value = "' + value + '"]').prop('selected', true);
	}
}

function selectValueForEdit(trait) {
	var traitName = trait.name;
    traitName = traitName.replace(/\s/g, '');
    var value = founder.traits[trait.name].value;
    $('#trait-value-' + traitName + ' option[value = "' + value + '"]').prop('selected', true);
}

$(document).on('change', '.trait-valuePool', function() {
	var vals = $(this).attr('data-values');
	vals = vals.split(',');
	var trait = {
		values: vals
	};
	var traitName = $(this).attr('id').split('-')[2];
	var valOpt = '';
	 $('#trait-value-' + traitName).empty();
    $.each(getPossibleValues(trait, traitName), function(index, value) {
    	valOpt += '<option value="' + value + '">' + value + '</option>';
    });
    $('#trait-value-' + traitName).append(valOpt);
});

function getPossibleValues(trait, traitName) {
	var vp1 = $('#trait-valuePool-' + traitName + '-1').children('option:selected').val();
	var vp2 = $('#trait-valuePool-' + traitName + '-2').children('option:selected').val();
	var vp3 = $('#trait-valuePool-' + traitName + '-3').children('option:selected').val();
	var vp4 = $('#trait-valuePool-' + traitName + '-4').children('option:selected').val();
	var vpArr = [vp1, vp2, vp3, vp4];
	var vpValid = [false, false, false, false];
	for(var i = 0; i < 3; i++) {
		for(var j = i+1; j <= 3; j++) {
			if(!vpValid[i] || !vpValid[j]) {
				var found = false;
				$.each(trait.values, function(index, value) {
					if(!found) {
						if(vpArr[i] == value) {
							found = true;
							vpValid[i] = true;
						}
						else if(vpArr[j] == value) {
							found = true;
							vpValid[j] = true;
						}
					}
				});
			}
		}
	}
	var vpFinal = [];
	for(var k = 0; k < 4; k++) {
		if(vpValid[k] && !vpFinal.includes(vpArr[k])) {
			vpFinal.push(vpArr[k]);
		}
	}
	return vpFinal;
}

$(document).on('mouseenter', '.invalid-founder', function() {
	$('.invalid-founder').css('border-color', 'red');
	$('.invalid-founder').css('color', 'red');
});

$(document).on('mouseleave', '.invalid-founder', function() {
	$('.invalid-founder').css('border-color', 'slategrey');
	$('.invalid-founder').css('color', 'black');
});

$('#dyn-founder-name-input').on('input', function() {
	if($(this).val() == null || $(this).val() == "") {
		if(!$('.create-founder').hasClass('invalid-founder')) {
			$('.create-founder').addClass('invalid-founder');
		}
	}
	else {
		$('.invalid-founder').removeClass('invalid-founder');
	}
});

$(document).on('click', '#cancel-founder-btn', function() {
	$('#founder-create-edit-view-overlay').hide();
	$('#dyn-founder-name-input').val('');
});

$(document).on('click', '.create-founder', function() {
	if(!$('.create-founder').hasClass('invalid-founder')) {
		var traitObj = {
			'Eye Color': getFounderTrait('EyeColor', founderTraits[5]),
			'Hair Color Red Scale': getFounderTrait('HairColorRedScale', founderTraits[10]),
			'Hair Color Dark Scale': getFounderTrait('HairColorDarkScale', founderTraits[9]),
			Hairline: getFounderTrait('Hairline', founderTraits[12]),
			'Nose Width': getFounderTrait('NoseWidth', founderTraits[16]),
			'Earlobe Connectivity': getFounderTrait('EarlobeConnectivity', founderTraits[4]),
			Sex: getFounderTrait('Sex', founderTraits[17]),
			Bald: getFounderTrait('Bald', founderTraits[0]),
			'Nose Bridge': getFounderTrait('NoseBridge', founderTraits[15]),
			Freckles: getFounderTrait('Freckles', founderTraits[8]),
			'Skin Color': getFounderTrait('SkinColor', founderTraits[18]),
			'Eye Size': getFounderTrait('EyeSize', founderTraits[6]),
			'Hair Straightness': getFounderTrait('HairStraightness', founderTraits[11]),
			Height: getFounderTrait('Height', founderTraits[13]),
			Dimples: getFounderTrait('Dimples', founderTraits[2]),
			'Dominant Hand': getFounderTrait('DominantHand', founderTraits[3]),
			'Cleft Chin': getFounderTrait('CleftChin', founderTraits[1]),
			'Lip Size': getFounderTrait('LipSize', founderTraits[14]),
			'Forlock Color': getFounderTrait('ForlockColor', founderTraits[7])
		};
		
		founder = {
			memberId: 0,
			name: $('#dyn-founder-name-input').val(),
			primaryDynasty: null,
			nonprimaryDynasties: [],
			spouse: null,
			matrilineal: false,
			children: [],
			father: null,
			mother: null,
			traits: traitObj,
			pastSpouses: [],
			living: true,
			founder: true
		};
		$('#temp-founder-display').hide();
		$('#founder-display').show();
    	$('#founder-name-display').text(founder.name);
    	$('#dyn-founder-name-input').val('');
    	$('#founder-create-edit-view-overlay').hide();
	}
});

function getFounderTrait(traitName, fullTrait) {
	var vp1 = $('#trait-valuePool-' + traitName + '-1').children('option:selected').val();
	var vp2 = $('#trait-valuePool-' + traitName + '-2').children('option:selected').val();
	var vp3 = $('#trait-valuePool-' + traitName + '-3').children('option:selected').val();
	var vp4 = $('#trait-valuePool-' + traitName + '-4').children('option:selected').val();
	return {
		trait: fullTrait,
		value: $('#trait-value-' + traitName).children('option:selected').val(),
		valuePool: [vp1, vp2, vp3, vp4]
	};
}
	
// Random Founder
$('#random-founder').click(function() {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/GenSim/random-founder',
		headers: {
        	"Accept": "application/json",
        	"Content-Type": "application/json"
    	},
    	success: function(member) {
    		$('#temp-founder-display').hide();
    		$('#founder-display').show();
    		$('#founder-name-display').text(member.name);
    		member.founder = true;
    		founder = member;
    	},
    	error: function(response) {
    		console.log(response);
    	}
	});
});

//View Founder
var viewClicked = false;
$('#view-founder-btn').click(function() {
	viewClicked = true;
	var mem = founder;
	var styleId = $('#crest-style-id').text();
	var designId = $('#crest-design-id').text();
	var pcr = Number(0 + $('#primary-red').val());
	var pcg = Number(0 + $('#primary-green').val());
	var pcb = Number(0 + $('#primary-blue').val());
	var scr = Number(0 + $('#secondary-red').val());
	var scg = Number(0 + $('#secondary-green').val());
	var scb = Number(0 + $('#secondary-blue').val());
	var priColors = [pcr, pcg, pcb];
	var secColors = [scr, scg, scb];
	
	mem.primaryDynasty = {
		name: $('#dyn-creator-name-input').val(),
		crestType: styleId,
		crestDesign: designId,
		primary: priColors,
		secondary: secColors
	}
	displayMemberInfo(mem);
});

$('.close').click(function() {
	if(viewClicked) {
		var overlay = $(this).parent().parent().attr('id');
		if(overlay == 'mem-info-overlay') {
			$('.current-svg').removeClass('current-svg');
			$('#crest-design-container svg').addClass('current-svg');
		}
	}
});

// Creation
function checkIfValid() {
	if($('#dyn-creator-name-input').val() == null || $('#dyn-creator-name-input').val() == '') {
		return false;
	}
	primColorCheck = false;
	if(!checkValidColors) {
		return false;
	}
	if(founder == null) {
		return false;
	}
	return true;
}

function checkValidColors() {
	if($('#primary-red').val() >= 0 && $('#primary-red').val() <= 255 && $('#primary-green').val() >= 0 && $('#primary-green').val() <= 255 && $('#primary-blue').val() >= 0 && $('#primary-blue').val() <= 255) {
		primColorCheck = true;
	}
	else {
		return false;
	}
	secondColorCheck = false;
	if(crestDesignId != 1) {
		if($('#secondary-red').val() >= 0 && $('#secondary-red').val() <= 255 && $('#secondary-green').val() >= 0 && $('#secondary-green').val() <= 255 && $('#secondary-blue').val() >= 0 && $('#secondary-blue').val() <= 255) {
			secondColorCheck = true;
		}
		else {
			return false;
		}
	}
	else {
		secondColorCheck = true;
	}
	return primColorCheck && secondColorCheck;
}

$('.crest-style-btn').click(function() {
	drawCrestStyleCustom('#crest-design-container', $('#crest-style-id').text());
	if(checkValidColors()) {
		drawCrestDesign();
	}
});

$('.crest-design-btn').click(function() {
	if(checkValidColors()) {
		drawCrestDesign();
	}
});

$('.color-input').on("input", function() {
	if(checkValidColors()) {
		drawCrestDesign();
	}
});

$('#dyn-create-submit').click(function() {
	if(checkIfValid()) {
		var primColor = [$('#primary-red').val(), $('#primary-green').val(), $('#primary-blue').val()];
		var secColor = [$('#secondary-red').val(), $('#secondary-green').val(), $('#secondary-blue').val()];
		var dynasty = {
			name: $('#dyn-creator-name-input').val(),
			crestType: $('#crest-style-id').text(),
			crestDesign: $('#crest-design-id').text(),
			primary: primColor,
			secondary: secColor,
			founder: founder
		};
		$.ajax({
			type: 'POST',
			url: 'http://localhost:8080/GenSim/new-dynasty',
			data: JSON.stringify(dynasty),
			headers: {
        		"Accept": "application/json",
        		"Content-Type": "application/json"
    		},
    		success: function() {
    			clearInputs();
				$('#dyn-creator-overlay').hide();
    		},
    		error: function() {
    			console.log("ERROR");
    		}
		});
	}
});

$('#dyn-create-submit').hover(function() {
	if(!checkIfValid()) {
		$('#dyn-create-submit').css('border-color', 'red');
		$('#dyn-create-submit').css('color', 'red');
	}
}, function() {
	$('#dyn-create-submit').css('border-color', 'slategrey');
	$('#dyn-create-submit').css('color', 'black');
});

$('#dyn-create-cancel').click(function() {
	clearInputs();
	$('#dyn-creator-overlay').hide();
});

function clearInputs() {
	$('#dyn-creator-name-input').val('');
	$('#primary-red').val('');
	$('#primary-green').val('');
	$('#primary-blue').val('');
	$('#secondary-red').val('');
	$('#secondary-green').val('');
	$('#secondary-blue').val('');
	crestDesignId = 1;
	crestStyleId = 1;
	$('#crest-style-id').text(crestStyleId);
	$('#crest-design-id').text(crestDesignId);
	founder = null;
	$('#temp-founder-display').show();
    $('#founder-display').hide();
}