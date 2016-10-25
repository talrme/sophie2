loaded = [];

$(document).ready(function() {
	
	// For hiding page content and showing the loading icon
	//$('#pageContent').hide();
	$('#loading').hide();

	//To get info on route (example): http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=actransit&r=52
 	//Note: make sure to get the Stop ID going in the right direction
 	// To add a new line - call getBusInfo, in the HTML file, copy a div and change ID accordingly
	// getBusInfo(bus line, title to display, stop ID, div ID); 	

 	getBusInfo("49","49A - Shattuck and Center","0304840","#49AHome");
	getBusInfo("49","49B - Shattuck and Allston","0304790","#49BHome");
	getBusInfo("88","88 - Shattuck and Center","9902090","#88Home");
	getBusInfo("1R","1R - Telegraph and Webster","0305630","#1RHome");
	getBusInfo("1","1 - Telegraph and Russel","0305590","#1Home");
	getBusInfo("18","18 - Shattuck and Russell","0305000","#18Home");
	getBusInfo("25","25 - Shattuck and Center","0306210","#25Home");
	getBusInfo("52","52 - University and MLK","0305980","#52Home");
	

	getBusInfo("49","49A - Sacramento and Dwight","0302220","#49AWork");
	getBusInfo("49","49B - Sacramento and Dwight","0302210","#49BWork");
	getBusInfo("88","88 - Sacramento and Dwight","0304230","#88Work");
	getBusInfo("25","25 - Hopkins and Carlotta","0303260","#25BWork");
	getBusInfo("25","25 - The Alameda and Hopkins","0305640","#25AWork");
	getBusInfo("18","18 - Sutter and Yolo","0305450","#18Work");
	getBusInfo("1","1 - Shattuck and Center","0301545","#1Work");
	getBusInfo("1","1R - Shattuck and Allston","0304790","#1RWork");

	getBusInfo("6","6 - Center and Shattuck","0301545","#6fromWork");	
	//When all data is loaded, hide loading gif and show page
	/*
	var test = window.setInterval(function(){
		if (checkLoadedArray(loaded)){
			$('#pageContent').show();
			$('#loading').hide();
			clearInterval(test);
			console.log("True");
		} else {
			console.log("False");
		}

	},5);
	*/
	
}); // End docment ready


function getBusInfo(route,routeTitle,stopID,divAttr){
	
	var loadedIndex = loaded.length;
	loaded[loadedIndex] = false;

	var URL = "https://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=actransit&r="+route+"&s="+stopID;
	$.ajax({
		url: URL,
		dataType: "xml",
		success: function(data){
			console.log("Raw Data For "+routeTitle+":");
			console.log(data);
			displayData(data,routeTitle,divAttr);
			loaded[loadedIndex] = true;

			
			//displayHourlyData(data);
		}

	});
}




function displayData(data,routeTitle,divAttr){

	var output = "";
	var itemInRow = 1;
	var displayDirections = false;
	output += '<div class="row"><div class="col-md-4"><b>Route ' + routeTitle +':</b>';

	console.log(routeTitle);
	if ($(data).find('direction').length>1){
		displayDirections = true;
		console.log("DISPLAY DIRECTIONS!");
	}

	$(data).find('direction').each(function(){
 
            var $direction = $(this); 
            var directionTitle = $direction.attr("title");          
            var times = [];
           	
           	//Show directions 
           	if (displayDirections){
           		if (directionTitle.indexOf("A Loop")>-1){
           			directionTitle = "To Home (A Loop)";
           		}
           		if (directionTitle.indexOf("B Loop")>-1){
           			directionTitle = "To Library (B Loop)";
           		}
           		output+='<br>Direction: '+directionTitle+':';
           	}

           	$direction.find('prediction').each(function(){
           		var secondsRemaining = ($(this).attr("seconds"));
           		var remainingToDisplay = secondsToMinutes(secondsRemaining);
           		output += '<br>'+ remainingToDisplay;
           		times.push(remainingToDisplay);

           	});
            
            

            console.log(directionTitle);
            console.log(times);

            

    });
	output += '</div></div>';
	$(divAttr).html(output);
	
}


function secondsToMinutes(seconds){
	seconds = parseInt(seconds);
	toDisplay = Math.round(seconds/60) + " minutes";
	if (seconds<60){
		toDisplay = "< 1 minute";
	}
	return toDisplay;
}


function checkLoadedArray(loaded){
	for (i=0; i<loaded.length; i++){
		if (loaded[i]==false){
			return false;
		}
	}
	return true;
}
/*
function displayHourlyData(data){
	var d = new Date();
	var hour = d.getHours();
	console.log(hour);

	var output = "";
	for (var i = 0; i<12; i++) {
		hour = hour%24;
		var currentHour = data.list[i];
		var imgURL = determineImageURL(currentHour.weather[0].icon);
		output += '<div class="col-sm-1">' +
				'<b><p  class="text-center">'+hour+':00</p></b>' +
				
				'<img class="img-rounded" src="'+imgURL+'">' +
				'<br><p class="text-center">' + Math.round(currentHour.main.temp) + '&deg</p>' +
				'</div>' ;
		hour += 3;
	}

	$('#hourly').html(output);


}
*/