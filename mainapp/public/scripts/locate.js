/* eslint-disable */
function geoLocation() {
  const output = document.getElementById('map');

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    output.innerHTML = `<p>Latitude is ${latitude}° <br>Longitude is ${longitude}°</p>`;

    const parameters = {
      lat: latitude,
      lon: longitude,
    };
    // Get nearby places through foursquare api in the backend
    $.get('/geolocate', parameters, (data) => {
      const $places = $('#rooms');
        $('#rooms').empty();
        $.each(data.places, function(key, value) {
            $('#rooms').append('<li><a href="#" onclick="switchRoom(\'' + value + '\')">' + value + '</a></li>');
        });


      // set the rooms
      // socket.emit('setrooms', data.places);
    });

    const img = new Image();
    img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=300x300&sensor=false`;

    output.appendChild(img);
  }

  function error() {
    output.innerHTML = 'Unable to retrieve your location';
  }

  output.innerHTML = '<p>Locating…</p>';
  navigator.geolocation.getCurrentPosition(success, error);
}
$(geoLocation);
