$(document).on('click', '.member-display', function() {
	getMemberFromDom(this, 1);
});

$(document).on('contextmenu', '.member-display', function(e) {
	getMemberFromDom(this, 2);
});

function getMemberFromDom(dom, click) {
	var id = $(dom).attr('id');
	var arr = id.split('-');
	getMemberDetails(arr[2], click);
}

function getMemberDetails(memberId, click) {
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/GenSim/full-member',
		data: memberId,
		headers: {
        	"Accept": "application/json",
        	"Content-Type": "application/json"
    	},
    	success: function(member) {
    		if(click == 1) {
    			displayMemberInfo(member);
    		}
    		else {
    			displayMemberOptionsTooltip(member);
    		}
    	},
    	error: function() {
    		console.log("ERROR");
    	}
	});
}

function displayMemberInfo(member) {
	$('#mem-info-overlay').show();
	$('#mem-info-crest').empty();
	$('#mem-info-name').empty();
	$('.mem-dynam-opt').empty();
	$('#mem-info-display-container').empty();
	$('#mem-rel-display-container').empty();
	
	//Draw Crest
	drawCrestStyleCustom('#mem-info-crest', member.primaryDynasty.crestType);
	drawCrestDesignCustom(member.primaryDynasty.crestDesign, member.primaryDynasty.primary[0], member.primaryDynasty.primary[1], member.primaryDynasty.primary[2], member.primaryDynasty.secondary[0], member.primaryDynasty.secondary[1], member.primaryDynasty.secondary[2], 'GradientMem');
	
	//Write Name
	$('#mem-info-name').text(member.name + " " + member.primaryDynasty.name);
	
	//Create Option Btns
	if(member.memberId != 0) {
		var marryBtn = "<button class='member-opt-btn marryBtn btn' id='marryBtn-" + member.memberId + "-" + member.traits.Sex.value + "'>Marry</button>";
		var divorceBtn = "<button class='member-opt-btn divorceBtn btn' id='divorceBtn-" + member.memberId + "'>Divorce</button>";
		var childBtn = "<button class='member-opt-btn childBtn btn' id='childBtn-" + member.memberId + "'>Have A Child</button>";
		if(member.spouse == null) {
			$('.mem-dynam-opt').append(marryBtn);
		}
		else {
			$('.mem-dynam-opt').append(divorceBtn);
			$('.mem-dynam-opt').append(childBtn);
		}
	}
	
	//Enter Trait Info
	$.each(member.traits, function(trait, index) {
		var tp = member.traits[trait];
		if(trait != 'Hair Color Red Scale' && trait != 'Hair Color Dark Scale') {
			var traitLine = "<div class='trait-display-line' id='trait-display-" + trait.replace(/\s/g, '') + "'></div>";
			$('#mem-info-display-container').append(traitLine);
			if(trait == 'Bald') {
				if(tp.value == 'Bald' && member.traits['Sex'].value == 'Male') {
					$('#trait-display-' + trait.replace(/\s/g, '')).text(trait + ": Balding");
				}
				else {
					if(member.traits['Sex'].value == 'Female') {
						$('#trait-display-' + trait.replace(/\s/g, '')).text(trait + ": Not Bald");
					}
					else {
						$('#trait-display-' + trait.replace(/\s/g, '')).text(trait + ": " + tp.value);
					}	
				}	
			}
			else {
				$('#trait-display-' + trait.replace(/\s/g, '')).text(trait + ": " + tp.value);
			}
		}
		else if(trait == 'Hair Color Red Scale') {
			var traitLine = "<div class='trait-display-line' id='trait-display-HairColor'></div>";
			$('#mem-info-display-container').append(traitLine);
			$('#trait-display-HairColor').text("Hair Color: " + getHairColor(member.traits['Hair Color Red Scale'].value, member.traits['Hair Color Dark Scale'].value));
		}
	});
	
	//Enter Relationship Info
	var dynLine = "<div class='rel-display-line' id='rel-display-dyn'>Dynasty: " + member.primaryDynasty.name + "</div>"
	$('#mem-rel-display-container').append(dynLine);
	
	
	var spouseLine = "<div class='rel-display-line' id='rel-display-spouse'></div>"
	$('#mem-rel-display-container').append(spouseLine);
	if(member.spouse != null) {
		$('#rel-display-spouse').text('Spouse: ' + member.spouse.name);
		var marriageLine = "<div class='rel-display-line' id='rel-display-marriage'></div>"
		$('#mem-rel-display-container').append(marriageLine);
		if(member.matrilineal) {
			$('#rel-display-marriage').text('Marriage Type: Matrilineal');
		}
		else {
			$('#rel-display-marriage').text('Marriage Type: Patrilineal');
		}
	}
	else {
		$('#rel-display-spouse').text('Spouse: None');
	}
	
	var motherLine = "<div class='rel-display-line' id='rel-display-mother'></div>"
	$('#mem-rel-display-container').append(motherLine);
	if(member.mother != null) {
		$('#rel-display-mother').text('Mother: ' + member.mother.name);
	}
	else {
		$('#rel-display-mother').text('Mother: None');
	}
	
	var fatherLine = "<div class='rel-display-line' id='rel-display-father'></div>"
	$('#mem-rel-display-container').append(fatherLine);
	if(member.father != null) {
		$('#rel-display-father').text('Father: ' + member.father.name);
	}
	else {
		$('#rel-display-father').text('Father: None');
	}
	
	if(member.children.length > 0) {
		var childLabel = "<div class='children-label'>Children: </div>"
		$('#mem-rel-display-container').append(childLabel);
		$.each(member.children, function(index, child) {
			var childLine = "<div class='rel-display-line' id='rel-display-" + child.memberId + "'>" + child.name + " " + child.primaryDynasty.name + "</div>";
			$('#mem-rel-display-container').append(childLine);
		});
	}
	
	if(member.pastSpouses.length > 0) {
		//TODO
	}
	
	if(member.nonprimaryDynasties.length > 0) {
		//TODO
	}
}

function getHairColor(red, dark) {
	if(dark == 'Black') {
		return dark;
	}
	if(red == 'Some') {
		if(dark == 'Dark') {
			return 'Chestnut';
		}
		else if(dark == 'Medium') {
			return 'Copper';
		}
		else if(dark == 'Light') {
			return 'Golden';
		}
		else {
			return 'White';
		}
	}
	else if(red == 'None') {
		if(dark == 'Dark') {
			return 'Dark Brown';
		}
		else if(dark == 'Medium') {
			return 'Brown';
		}
		else if(dark == 'Light') {
			return 'Light Blonde';
		}
		else {
			return 'Light Grey';
		}
	}
	else {
		if(dark == 'Dark') {
			return 'Auburn';
		}
		else if(dark == 'Medium') {
			return 'Ginger';
		}
		else if(dark == 'Light') {
			return 'Strawberry';
		}
		else {
			return 'Albino';
		}
	}
}

var popupDisplay = false;

function displayMemberOptionsTooltip(member) {
	var limitL = 800;
	var limitT = 500;
	popupDisplay = true;
	var popup = "<div class='popup mem-opt-popup' id='mem-opt-popup-" + member.memberId + "'></div>";
	$('body').append(popup);
	var marryBtn = "<button class='member-opt-btn member-opt-btn-popup marryBtn btn' id='marryBtn-" + member.memberId + "-" + member.traits.Sex.value + "'>Marry</button>";
	var divorceBtn = "<button class='member-opt-btn member-opt-btn-popup divorceBtn btn' id='divorceBtn-" + member.memberId + "'>Divorce</button>";
	var childBtn = "<button class='member-opt-btn member-opt-btn-popup childBtn btn' id='childBtn-" + member.memberId + "'>Have A Child</button>";
	if(member.spouse == null) {
		$('.mem-opt-popup').append(marryBtn);
	}
	else {
		$('.mem-opt-popup').append(divorceBtn);
		$('.mem-opt-popup').append(childBtn);
	}
	if($('#member-' + member.name + '-' + member.memberId).position().left + $('#member-' + member.name + '-' + member.memberId).width() > limitL) {
		if($('#member-' + member.name + '-' + member.memberId).position().top + $('#member-' + member.name + '-' + member.memberId).height() > limitT) {
			$('.mem-opt-popup').css("top", $('#member-' + member.name + '-' + member.memberId).position().top - $('.mem-opt-popup').height());
			$('.mem-opt-popup').css("left", $('#member-' + member.name + '-' + member.memberId).position().left - $('.mem-opt-popup').width());
		}
		else {
			$('.mem-opt-popup').css("top", $('#member-' + member.name + '-' + member.memberId).position().top + $('#member-' + member.name + '-' + member.memberId).height());
			$('.mem-opt-popup').css("left", $('#member-' + member.name + '-' + member.memberId).position().left - $('.mem-opt-popup').width());
		}
	}
	else {
		if($('#member-' + member.name + '-' + member.memberId).position().top + $('#member-' + member.name + '-' + member.memberId).height() > limitT) {
			$('.mem-opt-popup').css("top", $('#member-' + member.name + '-' + member.memberId).position().top - $('.mem-opt-popup').height());
			$('.mem-opt-popup').css("left", $('#member-' + member.name + '-' + member.memberId).position().left + $('#member-' + member.name + '-' + member.memberId).width());
		}
		else {
			$('.mem-opt-popup').css("top", $('#member-' + member.name + '-' + member.memberId).position().top + $('#member-' + member.name + '-' + member.memberId).height() + 15);
			$('.mem-opt-popup').css("left", $('#member-' + member.name + '-' + member.memberId).position().left + $('#member-' + member.name + '-' + member.memberId).width() + 15);
		}
	}
}

$(document).click(function(event) { 
	$target = $(event.target);
	if(!$target.closest('.mem-opt-popup').length && !$target.closest('.matrilinealSelect').length && !$target.closest('.name-input-popup').length && !$target.closest('.marryOptionsPopup').length && popupDisplay) {
    	$('.mem-opt-popup').remove();
    	$('.matrilinealSelect').remove();
    	$('.name-input-popup').remove();
    	$('.marryOptionsPopup').remove();
    	popupDisplay = false;
  	}        
});