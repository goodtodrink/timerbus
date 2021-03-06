var map;
var nowPos;

function initMap() {
    var markerArray = [];
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 22.6313855, lng: 120.2997725}
    });
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    var stepDisplay = new google.maps.InfoWindow;
    calculateAndDisplayRoute(
        directionsDisplay, directionsService, stepDisplay, map);
    var onChangeHandler = function() {
      calculateAndDisplayRoute(
          directionsDisplay, directionsService, stepDisplay, map);
    };


    // document.getElementById('start').addEventListener('change', onChangeHandler);
    // document.getElementById('end').addEventListener('change', onChangeHandler);
    document.getElementById('submit').addEventListener('click', onChangeHandler);
    
     var infoWindow = new google.maps.InfoWindow({map: map});

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      

      infoWindow.setPosition(pos);
      infoWindow.setContent('目前位置');
      nowPos = pos;
      autoEnter(directionsDisplay, directionsService, markerArray, stepDisplay, map);
      map.setCenter(pos);
      }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {

    handleLocationError(false, infoWindow, map.getCenter());
    // geolocation error
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);    
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  }}
}


function calculateAndDisplayRoute(directionsDisplay, directionsService,
  markerArray, stepDisplay, map, directionResult) {
  // First, remove any existing markers from the map.
//   var test = directionResult.routes[0].legs[0];
//  for(var j = 1;j < myRoute.steps.length;j+=2 ){ 
//    console.log(myRoute.steps[j].transit.departure_stop.name);
//    if(myRoute.steps[j].transit.departure_stop.name){
//      document.getElementById('getstation').innerHTML = myRoute.steps[j].transit.departure_stop.name;
//    }
// }


  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Retrieve the start and end locations and create a DirectionsRequest using
  // transit directions.
  console.log(nowPos);
  directionsService.route({
    // origin: document.getElementById('start').value,
    origin: nowPos,
    destination: document.getElementById('end').value,
    travelMode: google.maps.TravelMode.TRANSIT
  }, function (response, status) {
    // Route the directions and pass the response to a function to create
    // markers for each step.
    if (status === google.maps.DirectionsStatus.OK) {
      document.getElementById('warnings-panel').innerHTML =
        '<b>' + response.routes[0].warnings + '</b>';
      directionsDisplay.setDirections(response);
      showSteps(response, markerArray, stepDisplay, map);
    } else {
      // window.alert('Directions request failed due to ' + status);
    }
  });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
  // For each step, place a marker, and add the text to the marker's infowindow.
  // Also attach the marker to an array so we can keep track of it and remove it
  // when calculating new routes.
  var myRoute = directionResult.routes[0].legs[0];

  var sum = 0
 // document.getElementById('warnings-panel').innerHTML = '';
  for(var j = 1;j < myRoute.steps.length;j+=2 ){
       // console.log(myRoute.steps[j].transit);
        console.log(myRoute.steps[j].transit.departure_stop.name);
  }
  for (var i = 0; i < myRoute.steps.length ; i++) {
    var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
      //console.log(myRoute.steps[i].transit);
      marker.setMap(null);
      marker.setPosition(myRoute.steps[i].start_location);
      attachInstructionText(
      stepDisplay, marker, myRoute.steps[i].instructions, map);
      sum = sum +  myRoute.steps[i].duration.value;
      total = sum;
      document.getElementById('loop2').innerHTML = '總時間：' + parseInt(total/3600)+'時'+parseInt(total/60%60) + '分' + total%60 + '秒';
      document.getElementById('warnings-panel').innerHTML += '<br/>路段指示: ' + myRoute.steps[i].instructions + '<br/>路段距離: ' + myRoute.steps[i].distance.value + '公尺<br/>路段時程: ' + parseInt(myRoute.steps[i].duration.value/60%60) + '分' +parseInt(myRoute.steps[i].duration.value%60)+'秒'+'<br/>';
     
    
  
  }
 
}


function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function () {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}

function autoEnter(directionsDisplay, directionsService, markerArray, stepDisplay, map) {

  reg = new RegExp("(^|&)end=([^&]*)(&|$)");
  result = window.location.search.substr(1).match(reg);

  var end = result ? decodeURIComponent(result[2]) : null;
  document.getElementById("end").value = end;

  if (start != null && end != null)
    calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
}