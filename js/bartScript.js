$( document ).ready(function() {
    
	
	getInfo("nbrk","nbrk","South");
	getInfo("19th","19thN","","Richmond");
  getInfo("19th","19thS","",["Millbrae","SF Airport"]);
  getInfo("dbrk","dbrkN","North");
  getInfo("dbrk","dbrkS","South");
  getInfo("civc","civc","",["Richmond","Pittsburg/Bay Point"]);

});

function getInfo(station, div, requiredDirection,requiredDestination){
// note: required destination may be an array!	
	var URL = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig="+station+"&key=MW9S-E7SL-26DU-VV8V";
	
	$.ajax({
		url: URL,
		dataType: "xml",
		success: function(data){
			console.log("Raw Data:");
			//console.log(data);
			displayBartData(data,station, div,requiredDirection,requiredDestination);
		}

	});
}

function displayBartData(data,station,div,requiredDirection,requiredDestination){
	console.log(data);
	
	var arrayToDisplay = [];
    var newObject = {};

	$(data).find('etd').each(function(){
 
            var $destination = $(this); 
            var destinationTitle = $destination.find("destination").text();
                    
                      	

           	

           	$destination.find('estimate').each(function(){
           		var $estimate = $(this); 
           		var minutesRemaining = $(this).find("minutes").text();
           		var lineColor = $(this).find("hexcolor").text(); 
           		var direction = $(this).find("direction").text();

           		if (minutesRemaining=="Leaving"){
           			minutesRemaining=0;
           		}


           		
           		

           		newObject = {};
           		newObject.direction = destinationTitle;
           		newObject.minutesRemaining = minutesRemaining;
           		newObject.arrivalTime = getArrivalTime(minutesRemaining);
           		newObject.lineColor = lineColor;

           		//if there is a requirement, make sure it's met (required dest, required direction)
           		var addToArray = true;
           		if (requiredDirection) {
           			if (requiredDirection.indexOf(direction) == -1){
           				addToArray=false;
           			}
           		}
           		if(requiredDestination){
           			if(requiredDestination.indexOf(destinationTitle) == -1){
           				addToArray=false;
           			}
           		}
           		
           		if (addToArray){
           			arrayToDisplay.push(newObject);
           		}
           		
           	});
            
    }); // end each etd

	//Sort array:
	arrayToDisplay.sort(compare);


	var output = "";
	$.each(arrayToDisplay,function(index,train){
		output += '<button type="button" style="background-color:'+train.lineColor+'">'+train.direction+' - '+train.arrivalTime+' ('+train.minutesRemaining+' min)</button><br>'
	});
	$("#"+div).html(output);

	
	console.log(arrayToDisplay);
	

} // end displayBartData

function getArrivalTime(minutesRemaining){
	var timeNow = new Date($.now());
	var arrivalTimeObject = new Date(timeNow.getTime() + minutesRemaining*60000);
	var hours = arrivalTimeObject.getHours();
	var minutes = arrivalTimeObject.getMinutes();
	if (minutes<10){
		minutes = "0"+minutes;
	}
	var arrivalTime = hours+":"+minutes;
	return arrivalTime;
}

function compare(a,b) {
  if (Number(a.minutesRemaining) < Number(b.minutesRemaining))
    return -1;
  if (Number(a.minutesRemaining) > Number(b.minutesRemaining))
    return 1;
  return 0;
}