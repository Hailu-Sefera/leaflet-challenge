// Selectable backgrounds of map - tile layers:
// grayscale background.
var grayScale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaGFpbHVzZWZlcmEiLCJhIjoiY2sybDVoYmt3MDNrZTNjcG1oeDNlc2l6aCJ9.g-GSY7wBMahvJ8uKjiZTig");

// satellite background.
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaGFpbHVzZWZlcmEiLCJhIjoiY2sybDVoYmt3MDNrZTNjcG1oeDNlc2l6aCJ9.g-GSY7wBMahvJ8uKjiZTig");

// outdoors background.
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaGFpbHVzZWZlcmEiLCJhIjoiY2sybDVoYmt3MDNrZTNjcG1oeDNlc2l6aCJ9.g-GSY7wBMahvJ8uKjiZTig");

// map object to an array of layers created.
var map = L.map("map", {
  center: [35, -98],
  zoom: 6,
  layers: [grayScale, satellite, outdoors]
});

// adding the 'graymap' layer.
grayScale.addTo(map);

// layers for earthquakes sets of data, 
var earthquakes = new L.LayerGroup();

// base layers
var baseMaps = {
  Satellite: satellite,
  Grayscale: grayScale,
  Outdoors: outdoors
};

// overlays 
var overlayMaps = {
  "Earthquakes": earthquakes
};

// control which layers are visible.
L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);

// retrieve earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {


  function styleInfo(feature) {
    return {
      fillOpacity: 1,
      opacity: 0.8,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Color by magnitude
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "Red";
      case magnitude > 4:
        return "Blue";
      case magnitude > 3:
        return "Purple";
      case magnitude > 2:
        return "Orange";
      case magnitude > 1:
        return "Yellow";
      default:
        return "Green";
    }
  }

  // earthquake radius
  function getRadius(magnitude) {
    return magnitude * 2 + 1;
  }

  // add layer
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>" + "Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "Green",
      "Yellow",
      "Orange",
      "Purple",
      "Blue",
      "Red"
    ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;

  };


  legend.addTo(map);

});