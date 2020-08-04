function selectDynasty() {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/GenSim/dynasty-selector',
		headers: {
        	"Accept": "application/json",
        	"Content-Type": "application/json"
    	},
    	success: function(dynasties) {
    		searchDisplay(dynasties);
    	},
    	error: function(response) {
    		console.log(response);
    	}
	});
}

function searchDisplay(dynasties) {
	$('#search-table-body').empty();
	$.each(dynasties, function(index, dynasty) {
		var dynRow = "<tr class='search-display-dyn' id='search-display-" + dynasty.name + "'>";
		dynRow += "<td class='select-crest'>Crest</td>";
		dynRow += "<td class='select-name'>" + dynasty.name + "</td>";
		dynRow += "<td class='select-dyn-name'>" + dynasty.founder.name + "</td>";
		dynRow += "<td class='select-all'>" + dynasty.allMembers.length + "</td>";
		dynRow += "<td class='select-prime'>" + dynasty.primaryMembers.length + "</td>";
		dynRow += "</tr>";
		$('#search-table-body').append(dynRow);
	});
}

$('#dyn-selector-search-input').on("input", function() {
	if($('#dyn-selector-search-input').val() == '') {
		selectDynasty();
	}
	else {
		$.ajax({
			type: 'POST',
			url: 'http://localhost:8080/GenSim/dynasty-selector-search',
			data: $('#dyn-selector-search-input').val(),
			headers: {
        		"Accept": "application/json",
        		"Content-Type": "application/json"
    		},
    		success: function(dynasties) {
    			searchDisplay(dynasties);
    		},
    		error: function(response) {
    			console.log(response);
    		}
		});
	}
});

$(document).on('click', '.search-display-dyn', function() {
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/GenSim/dynasty-selector-select',
		data: $(this).attr('id').substring(15),
		headers: {
       		"Accept": "application/json",
       		"Content-Type": "application/json"
   		},
   		success: function(dynasty) {
   			$('#dyn-selector-overlay').hide();
   			displayDynastyMain(dynasty);
   		},
   		error: function(response) {
   			console.log(response);
   		}
	});
});