var config = {
    apiKey: "AIzaSyDtmu1aLMppGBlZwWD1VcS3F1QOZR3Ote8",
    authDomain: "eventfinder-project1.firebaseapp.com",
    databaseURL: "https://eventfinder-project1.firebaseio.com",
    projectId: "eventfinder-project1",
    storageBucket: "eventfinder-project1.appspot.com",
    messagingSenderId: "228677590028"
};
// $("#weather-div").hide();
// $("#event-div").hide();
// $("#fave-div").hide();
$("#portfolio").hide();
$("#recentSearchBox").hide();
firebase.initializeApp(config);

var database = firebase.database();
console.log(database);

$("#submit").on("click", function (event) {
  event.preventDefault();
  var searchQ = $("#pac-input").val().trim();
  console.log("Searched: " + searchQ);

  // Weather API
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchQ + "&units=imperial&appid=17d594f0d627f8656d2fab0b960e2a20";

  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {

      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(response);

      var weatherDiv = $("#weather-display").html("<h1>" + response.name + " Weather Details</h1>" + "<div>Wind speed " + response.wind.speed + "mph</div>" + "<div> humidity " + response.main.humidity + "%</div>" + "<div>Temperature " + response.main.temp + "F</div>");
      // $("#weather-div").show();
      $("#portfolio").show();





      console.log("Wind Speed: " + response.wind);
      console.log("Humidity: " + response.main.humidity);
      console.log("Temperature (F): " + response.main.temp);
    });
});


var map;
var service;
var infowindow;

function initMap() {

  //map options
  var options = {
    zoom: 12,
    center: { lat: 40.7128, lng: -74.0060 }
  }
  infoWindow = new google.maps.InfoWindow;
  //gmap
  var map = new google.maps.Map(document.getElementById("map"), options);

  //geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  var input = document.getElementById("pac-input");
  var searchBox = new google.maps.places.SearchBox(input);

  

  $("#submit").on("click", function (event) {
    event.preventDefault();
    // input = $(input).val().trim();
    console.log("Searched " + input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
      zoom: 12;
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function (marker) {
        marker.setMap(null);
      });
      markers = [];

      // Get icon, name, location
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each search
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location,
          animation: google.maps.Animation.DROP,
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
      
    });
  })
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });


  input = $("#pac-input").val().trim();



  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    

    // Get icon, name, location
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each search city location
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
     
      //This function returns JSON object from the Eventful.com API, set query parameters here
      function eventApi() {
        var app_key = "zQnmrwHxBczn4Htn"
        var where = $("#pac-input").val().trim();
        var query = "music"
        var https = "&scheme=https";
        var oArgs = {
          app_key: app_key.valueOf(),
          q: query.valueOf(),
          location: where.valueOf(),
          within: 1,
          "date": "This Week",
          "include": "tags,categories",
          page_size: 5,
          sort_order: "popularity",
          https: https.valueOf(),
        }
        //use the Eventful library to call the query
        EVDB.API.call("/events/search", oArgs, function (oData) {
          var event1 = oData.events.event[0]
          var event2 = oData.events.event[1]
          var event3 = oData.events.event[2]
          var event4 = oData.events.event[3]
          var event5 = oData.events.event[4]
          var mapMarkerArray = [event1, event2, event3, event4, event5]
          
          //append the fetched events to the doc
          var eventDiv = $("#event-display").html("<h1>" + "1. " + event1.title + "</h1>" + "<div>Venue: " + event1.venue_name + "</div>" + "<div> Start Time: " + event1.start_time + "<a href=" + event1.url + ">" + "<br>" + "Info" + "</a>" + "</div>" + "<br>" +
            "<h1>" + "2. " + event2.title + "</h1>" + "<div>Venue: " + event2.venue_name + "</div>" + "<div> Start Time: " + event2.start_time + "<a href=" + event2.url + ">" + "<br>" + "Info" + "</a>" + "</div>" + "<br>" +
            "<h1>" + "3. " + event3.title + "</h1>" + "<div>Venue: " + event3.venue_name + "</div>" + "<div> Start Time: " + event3.start_time + "<a href=" + event3.url + ">" + "<br>" + "Info" + "</a>" + "</div>" + "<br>" +
            "<h1>" + "4. " + event4.title + "</h1>" + "<div>Venue: " + event4.venue_name + "</div>" + "<div> Start Time: " + event4.start_time + "<a href=" + event4.url + ">" + "<br>" + "Info" + "</a>" + "</div>" + "<br>" +
            "<h1>" + "5. " + event5.title + "</h1>" + "<div>Venue: " + event5.venue_name + "</div>" + "<div> Start Time: " + event5.start_time + "<a href=" + event5.url + ">" + "<br>" + "Info" + "</a>" + "</div>" + "<br>");
            $("#event-div").show();
    
            //appends event map markers to google map
            // var mapMarkerArray = [event1, event2, event3, event4, event5]
            
            for (i = 0; i < mapMarkerArray.length; i++) {
              var newLat = parseFloat(mapMarkerArray[i].latitude);
              var newLng = parseFloat(mapMarkerArray[i].longitude);
              var myLatLng = {lat: newLat, lng: newLng};
              var markerClick = mapMarkerArray[i].url;
              var mapMarkerLabels = ["1", "2", "3", "4", "5"]
              console.log(markerClick);
              marker = new google.maps.Marker({
                icon: icon,
                title: oData.events.event[i].title,
                position: myLatLng,
                url: markerClick,
                map: map,
                animation: google.maps.Animation.DROP,
                label: {
                  text: mapMarkerLabels[i],
                  size: 12
                }
              })
              marker.setMap(map);
              marker.addListener('click', function() {
                window.open(this.url, '_blank')

              })
              // console.log(newLat)
              // console.log(newLng)
          };
            
            
            
        })
      }
      eventApi(); 

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
};



//geolocation error messages for user
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


//session storage on search click (used for recent searches, but that is unused in v1.0)

$("#submit").on("click", function (event) {
  // This line prevents the page from refreshing when a user hits "enter".
  event.preventDefault();

  // Grab the user input
  var userSearch = $("#pac-input").val().trim();

  var valid = (userSearch.search(/^[A-Za-z]+$/) != -1)

  console.log(valid);
  if (valid == false) {
    //  document.getElementById("val-msg").style.display=""
    console.log("Not Valid");
  }
  else {
    // Store the username into localStorage using "localStorage.setItem"
    sessionStorage.setItem("Location", userSearch);

    // And display that name for the user using "localStorage.getItem"
    $("table tbody").append("<tr><td>" + userSearch + "</td></tr>");
    $("#recentSearches").show();
  }
});


// databse starts here
var faveDisplay = [];

database.ref().on("child_added", function (snapshot) {

  faveDisplay = (snapshot.val().faveCity);

  $("#fave-display").prepend("<div>" + faveDisplay + "</div>");

  $("#fave-btn").on("click", function (event) {
    event.preventDefault();

    $("#fave-div").show();
    var faveCity = "";


    faveCity = $("#pac-input").val().trim();

    // Change what is saved in firebase, only save if the input is correct
    database.ref().push({
      faveCity: faveCity,
      dateAdded: firebase.database.ServerValue.TIMESTAMP

    })

  });
});
