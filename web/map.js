var map, pointarray, heatmap;

var coordinateArray = [
// PUT CO-ODS in here
];

function initialize() {
  var mapOptions = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  //if the user allows geo location to track them, center in on their coordinates
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
          map: map,
          position: pos,
          content: 'Location found using HTML5.'
        });

        map.setCenter(pos);
    }, function() {
        handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    	handleNoGeolocation(false);
    }
    //if the user does not allow tracking, the error messages will result
    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
           var content = 'Error: The Geolocation service failed.';
        } else {
    	    var content = 'Error: Your browser doesn\'t support geolocation.';
        }
   	var options = {
            map: map,
            position: new google.maps.LatLng(60, 105),
    	    content: content
        };
	var infowindow = new google.maps.InfoWindow(options);
    	map.setCenter(options.position);
    }

//create the Array for the data points, because it is an MVC Array we can simply append a new coordinate and it will appeasr
     var pointArray = new google.maps.MVCArray(coordinateArray);

//use the data point array on the heatmap layer
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray
    });

    heatmap.setMap(map);
}

google.maps.event.addDomListener(window,'load',initialize);   
