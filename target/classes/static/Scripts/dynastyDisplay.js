var currentDynasty;
var maxRow;

function displayDynastyMain(dynasty) {
	currentDynasty = dynasty;
	$('#no-dyn').hide();
	$('#dyn-content').empty();
	displayDynastyHeader(dynasty);
	var founder = dynasty.founder;
	displayFounder(founder, dynasty);
	displayChildren(founder, dynasty, 0);
}

function displayDynastyHeader(dynasty) {
	drawCrestStyleCustom('#dyn-icon', dynasty.crestType);
	drawCrestDesignCustom(dynasty.crestDesign, dynasty.primary[0], dynasty.primary[1], dynasty.primary[2], dynasty.secondary[0], dynasty.secondary[1], dynasty.secondary[2], 'GradientDyn');
	$('#dyn-name').text(dynasty.name);
}

function displayFounder(member, dynasty) {
	maxRow = 0;
	var row = "<div class='row dyn-display-row' id='dyn-display-row-0'></div>";
	$('#dyn-content').append(row);
	var dom = createMemberDisplayDom(member, dynasty);
	$('#dyn-display-row-0').append(dom);
	var id = 'member-' + member.name + '-' + member.memberId;
	id = id.replace(/\s/g, '');
	$('#' + id).addClass('founder-member');
	configureMemberDom(member);
	if(member.spouse != null) {
		displaySpouse(dynasty, member, 0, true);
	}
	//Handle Previous Spouses Here
}

function displaySpouse(dynasty, spouse, row, current) {
	var member = spouse.spouse;
	var spouseDom = createMemberDisplayDom(member, dynasty);
	drawMarriageConnector(spouse, member, current, row);
    $('#dyn-display-row-' + row).append(spouseDom);
	configureMemberDom(member);
}

function displayChildren(member, dynasty, prevRow) {
	if(member.children.length > 0) {
		if(prevRow == maxRow) {
			maxRow += 1;
			var row = "<div class='row dyn-display-row' id='dyn-display-row-" + maxRow + "'></div>";
			$('#dyn-content').append(row);
		}
		$.each(member.children, function(index, child) {
			displayChild(child, member, dynasty, prevRow+1, index);
			if(child.primaryDynasty.name == dynasty.name) {
				if(child.spouse != null) {
					displaySpouse(dynasty, child, prevRow+1, true);
				}
				
				//Handle Previous Spouses Here
				
				if(child.children.length > 0) {
					displayChildren(child, dynasty, prevRow+1);
				}
			}
		});
	}
}


function displayChild(child, parent, dynasty, row, index) {
	var childDom = createMemberDisplayDom(child, dynasty);
    $('#dyn-display-row-' + row).append(childDom);
	configureMemberDom(child);
	drawChildConnector(child, parent, row, index);
}


function createMemberDisplayDom(member, dynasty) {
	var id = 'member-' + member.name + '-' + member.memberId;
	id = id.replace(/\s/g, '');
	var dom;
	if(member.primaryDynasty.name == dynasty.name) {
		dom = "<span class='member-display primary-member-display' id=" + id + ">" + member.name + "</span>";
	}
	else {
		dom = "<span class='member-display' id=" + id + ">" + member.name + "</span>";
	}
	if(member.primaryDynasty.name != dynasty.name) {
		dom += "<span class='crest-small-display' id='small-crest-" + member.memberId + "-" + dynasty.name + "'></span>";
	}
	return dom;
}

function drawMarriageConnector(member, spouse, current, row) {
	if(current) {
		var lineDom = "<span class='connecting-line' id='marriage-" + member.memberId + "-" + spouse.memberId + "'></span>"
		$('#dyn-display-row-' + row).append(lineDom);
		var svg = '<svg width="50" height="30" xmlns="http://www.w3.org/2000/svg">'
		svg += '<line stroke-dasharray="10,10" stroke-linecap="undefined" stroke-linejoin="undefined" id="dash10-connector" y2="25" x2="50" y1="25" x1="0" stroke-width="5.0" stroke="#000" fill="none"/>'
		svg += '</svg>'
		$('#marriage-' + member.memberId + '-' + spouse.memberId).append(svg);
	}
}

function drawChildConnector(child, parent, row, index) {
	var parentIndex = getParentIndex(child, parent);
	//Parent Vertical Connector
	if(index == 0) {
		var lineDom = "<span class='down-line' id='down-" + row + "-" + parentIndex + "-" + parent.memberId + "'></span>"
		$('#dyn-content').append(lineDom);
		var svg = '<svg width="20" height="30" xmlns="http://www.w3.org/2000/svg">'
		svg += '<line stroke-linecap="undefined" stroke-linejoin="undefined" id="down-connector" y2="0" x2="10" y1="30" x1="10" stroke-width="5.0" stroke="#000" fill="none"/>'
		svg += '</svg>'
		$('#down-' + row + '-' + parentIndex + '-' + parent.memberId).append(svg);
		var priParentId = parent.memberId;
		var secParentId;
		if(child.father.memberId == priParentId) {
			secParentId = child.mother.memberId;
		}
		else {
			secParentId = child.father.memberId;
		}
		$('#down-' + row + '-' + parentIndex + '-' + parent.memberId).css('top', $('#marriage-' + priParentId + '-' + secParentId).position().top + $('#marriage-' + priParentId + '-' + secParentId).height())
		$('#down-' + row + '-' + parentIndex + '-' + parent.memberId).css('left', $('#marriage-' + priParentId + '-' + secParentId).position().left + $('#marriage-' + priParentId + '-' + secParentId).width() / 2)
	}
	//Horizontal Connector
	var startL =  $('#down-' + row + '-' + parentIndex + '-' + parent.memberId).position().left + 10;
	var startT = $('#down-' + row + '-' + parentIndex + '-' + parent.memberId).position().top + 30;
	var endL = $('#member-' + child.name + '-' + child.memberId).position().left + $('#member-' + child.name + '-' + child.memberId).width()/2 + 10;
	var lineDomH = "<span class='child-line' id='child-line-" + child.memberId + "'></span>"
	$('#dyn-content').append(lineDomH);
	var svgH = '<svg width="' + Math.abs(startL - endL) + '" height="30" xmlns="http://www.w3.org/2000/svg">'
	svgH += '<line stroke-linecap="undefined" stroke-linejoin="undefined" id="child-connector" y2="5" x2="' + Math.abs(startL - endL) + '" y1="5" x1="0" stroke-width="5.0" stroke="#000" fill="none"/>'
	svgH += '</svg>'
	$('#child-line-' + child.memberId).append(svgH);
	$('#child-line-' + child.memberId).css('top', startT);
	if(startL > endL) {
		$('#child-line-' + child.memberId).css('left', endL);
	}
	else {
		$('#child-line-' + child.memberId).css('left', startL);
	}
	
	//Vertical Connector
	var startLV = $('#member-' + child.name + '-' + child.memberId).position().left + $('#member-' + child.name + '-' + child.memberId).width()/2;
	var startTV = $('#child-line-' + child.memberId).position().top;
	var lineDomV = "<span class='child-line' id='child-line-down-" + child.memberId + "'></span>"
	$('#dyn-content').append(lineDomV);
	var svgV = '<svg width="20" height="15" xmlns="http://www.w3.org/2000/svg">'
	svgV += '<line stroke-linecap="undefined" stroke-linejoin="undefined" id="child-connector" y2="15" x2="10" y1="0" x1="10" stroke-width="5.0" stroke="#000" fill="none"/>'
	svgV += '</svg>'
	$('#child-line-down-' + child.memberId).append(svgV);
	$('#child-line-down-' + child.memberId).css('top', startTV);
	$('#child-line-down-' + child.memberId).css('left', startLV);
}

function getParentIndex(child, parent) {
	var priParentId = parent.memberId;
	var secParentId;
	if(child.father.memberId == priParentId) {
		secParentId = child.mother.memberId;
	}
	else {
		secParentId = child.father.memberId;
	}
	if(parent.spouse.memberId == secParentId) {
		return 0;
	}
	$.each(parent.pastSpouses, function(index, spouse){
		if(spouse.memberId == secParentId) {
			return index + 1;
		}
	});
}

function configureMemberDom(member) {
	var w = member.name.length*10 + 10;
	var id = 'member-' + member.name + '-' + member.memberId;
	id = id.replace(/\s/g, '');
	$('#' + id).width(w);
}