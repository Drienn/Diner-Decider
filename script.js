$(document).ready(function() {
  console.log("ready!");



  var infowindow;

  $('#submit').click(function() {
    var price = $('#price-select').val();
    var distance = $('#distance-select').val();
    var cuisine = $('#cuisine-select').val();

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 33.448376,
        lng: -112.074036
      },
      zoom: 15
    });
    var infoWindow = new google.maps.InfoWindow({
      map: map
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('You are Here!.');
          map.setCenter(pos);
          var marker = new google.maps.Marker({
            position: pos,
            map: map
          });

          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: pos,
            radius: distance,
            type: ['restaurant'],
            keyword: cuisine,
            maxPriceLevel: price,
          }, callback);

          function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                // createMarker(results[i]);
                results.sort(function() {
                  return Math.random() - .5
                })


                var request = {
                  placeId: results[i].place_id
                };

                service = new google.maps.places.PlacesService(map);
                service.getDetails(request, callback);

                function callback(place, status) {
                  if (status == google.maps.places.PlacesServiceStatus.OK) {
                    // createMarker(place);
                  }
                }
              }
              console.log(results[0]);
              $('#map').empty().append(`<a href="https://www.google.com/maps/maps/${results[0].name}${results[0].vicinity}" target="_blank"><span id="chosen-name">${results[0].name}</span><br>
              <span id="chosen-address">${results[0].vicinity}</a></span>`);

            }
          }

          // function createMarker(place) {
          //   var placeLoc = place.geometry.location;
          //   var marker = new google.maps.Marker({
          //     map: map,
          //     position: place.geometry.location
          //   });
          //
          //   google.maps.event.addListener(marker, 'click', function() {
          //     infowindow.setContent(place.name);
          //     infowindow.open(map, this);
          //   });
          // }

        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    }


  })



});
