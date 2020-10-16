var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


var geojsonMarkerOptions;
// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
//   L.geoJson(data).addTo(myMap);
    // console.log(data.features[0].geometry.coordinates[2])
    


    console.log(data)
    L.geoJson(data, {
        
        
        pointToLayer: function (feature,latlng) {
            // console.log(feature.geometry.coordinates[2])
            var fillColor,
                depth = feature.geometry.coordinates[2];
                if ( depth > 90 ) fillColor = "#FF0000";
                else if ( depth > 70 ) fillColor = "#FF6600";
                else if ( depth > 50 ) fillColor = "#FFCC00";
                else if ( depth > 30 ) fillColor = "#FFFF00";
                else if ( depth > 10 ) fillColor = "#99FF00";
                else if ( depth > -10 ) fillColor = "#00FF00";
                else fillColor = "#00FF00";
            var geojsonMarkerOptions = {

                    radius: feature.geometry.coordinates[2],
                    fillColor: fillColor,
                    color: "black",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };
            
            

            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Place: " + feature.properties.place + "<hr>Depth: " + feature.geometry.coordinates[2])
        }

    }).addTo(myMap);

    // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["-10-10","10-30","30-50","50-70", "70-90", "90+"];
    var colors = ["#00FF00","#99FF00","#FFFF00","#FFCC00","#FF6600","#FF0000"];
    var labels = [];

    limits.forEach(function(limit, index) {
          labels.push(`<li style="background-color: ${colors[index]}">${limit}</li>`);
        });

    // Add min & max
    var legendInfo = "<div style=\"background-color: white\">"+
      "<div class=\"labels\">" +
      "<ul style=\"list-style-type:none;\">" + labels.join("") + "</ul>"
      "</div> </div>";

    div.innerHTML = legendInfo;

    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});

 