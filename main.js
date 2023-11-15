// Parse any coordinate system
function parseCoord(coordinateString){
	if (!coordinateString) {
		return null; // Input validation
	}

	var decimal = /^([-+]?)(\d+)\.(\d+)\,[ \n\t]*([-+]?)(\d+)\.(\d+)$/m,
		DMMC = /^(\d+)°(\d+)\'(\d+)\.(\d+)\"([NS])[ \n\t]*(\d+)°(\d+)\'(\d+)\.(\d+)\"([WE])$/m,
		CDMM = /^([NS]) ?(\d+)° ?(\d+)\' ?(\d+)\.(\d+)\"[ \n\t]*([WE]) ?(\d+)° ?(\d+)\' ?(\d+)\.(\d+)\"/m,
		match,
		lat,
		lon;

	coordinateString = coordinateString.toUpperCase();

	if(match = decimal.exec(coordinateString)){
		var lat_cardinal = match[1],
			lat_deg      = match[2],
			lat_dec      = match[3],
			lon_cardinal = match[4],
			lon_deg      = match[5],
			lon_dec      = match[6];
			lat = parseFloat(lat_cardinal+lat_deg+'.'+lat_dec);
			lon = parseFloat(lon_cardinal+lon_deg+'.'+lon_dec);
		return {lat:lat, lon:lon}
	} else if(match = DMMC.exec(coordinateString)){
		var 
			lat_deg       = match[1],
			lat_min       = match[2],
			lat_sec       = match[3],
			lat_dsec      = match[4],
			lat_cardinal  = match[5],
			lon_deg       = match[6],
			lon_min       = match[7],
			lon_sec       = match[8],
			lon_dsec      = match[9],
			lon_cardinal  = match[10];
	} else if(match = CDMM.exec(coordinateString)){
		var 
			lat_cardinal  = match[1],
			lat_deg       = match[2],
			lat_min       = match[3],
			lat_sec       = match[4],
			lat_dsec      = match[5],
			lon_cardinal  = match[6],
			lon_deg       = match[7],
			lon_min       = match[8],
			lon_sec       = match[9],
			lon_dsec      = match[10];
	}else{
		return null;
	}

	lat = parseInt(lat_deg)+(lat_min/60)+(parseFloat(lat_sec+'.'+lat_dsec)/3600);
	lon = parseInt(lon_deg)+(lon_min/60)+(parseFloat(lon_sec+'.'+lon_dsec)/3600);
	if(lat_cardinal=='S'){
		lat=lat * -1;
	}
	if(lon_cardinal=='W'){
		lon=lon * -1;
	}
	return {lat:lat, lon:lon}

}

// Helper function to convert decimal degrees to DMS format
function convertToDMSFormat(decimal,format) {
	var degrees = Math.floor(Math.abs(decimal));
	var minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
	var seconds = ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(1);
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	if(format==2){
		return degrees + '° ' + minutes + `' ` + seconds + '"';
	}else{
		return degrees + '°' + minutes + `'` + seconds + '"';
	}
}

// Convert decimal to DMS
function convertToDMS(decimalCoords, format) {
	var lat = decimalCoords.lat;
	var lon = decimalCoords.lon;

	// Determine cardinal directions
	var latCardinal = lat >= 0 ? 'N' : 'S';
	var lonCardinal = lon >= 0 ? 'E' : 'W';

	// Convert decimal coordinates to DMS format
	var latDMS = convertToDMSFormat(lat, format);
	var lonDMS = convertToDMSFormat(lon, format);

	if(format==2){
		return latCardinal+' '+latDMS+' '+lonCardinal+' '+lonDMS;
	}else if(format==3){
		return latCardinal+' '+latDMS+"\n"+lonCardinal+' '+lonDMS;
	}else{
		return latDMS+latCardinal+' '+lonDMS+lonCardinal;
	}

}

// Add your JavaScript code to listen to textarea changes and update the results below.
document.getElementById('coordinatesTextarea').addEventListener('input', function () {
	var coordinates = this.value;
	
	// Call your coordinate conversion function and update the results
	var parsedCoords = parseCoord(coordinates);
	if (parsedCoords) {
		document.getElementById('decimalOutput').innerText = 'Decimal: ' + parsedCoords.lat.toFixed(6) + ', ' + parsedCoords.lon.toFixed(6);
		document.getElementById('dmscOutput').innerText = 'DMSC: ' + convertToDMS(parsedCoords, 1);
		document.getElementById('cdmsOutput').innerText = 'CDMS: ' + convertToDMS(parsedCoords, 2);
	} else {
		document.getElementById('decimalOutput').innerText = '';
		document.getElementById('dmsOutput').innerText = '';
	}
});
