function geoLocation() {
  var output = document.getElementById("map");

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    var parameters = { 
      lat: latitude,
      lon: longitude
    };
    // Get nearby places through foursquare api in the backend
    $.get( '/geolocate', parameters, function(data) {
      console.log(data.places);
      var $places= $('#places');
      var $ul = $('<ul/>');
      $ul.appendTo($places);
      for(var i in data.places){
        var $li = $('<li/>');
        $li.text(data.places[i]);
        $li.appendTo($ul);
      }
    });

    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);
  };

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  output.innerHTML = "<p>Locating…</p>";
  navigator.geolocation.getCurrentPosition(success, error);
}
$(geoLocation);