{
	 "use strict";
		 
	// base maps
	    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 20,
						attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					});
};

function featurePopupContent(feature) {
    var link = '<a target="_blank" alt="Link to further information in separate tab" href=' + feature.properties.url + '>Link to further information in separate tab </a>';
    const contents = 'Name:'  + ' ' + feature.properties["name"] + ' ' + feature.properties["description"] + ' ' + url
    return contents
}

function makeMarker(feature, letter)
{ 
   var theIcon = L.divIcon({  html: letter,
     className: "svg-icon",
     iconSize: [20,30],
     iconAnchor: [10,20]
   });
   if (letter == 'C') {
    desc = 'Current'
   } else {
    desc = 'Historic'
   }
    return L.marker(feature.latlng, 
                    {icon: theIcon,
                    riseOnHover: true,
                    riseOffset: 500,
                    opacity: 0.9,
                     alt: desc,
                    title: desc});
};



function dataMarker(feature) {
    if (feature.properties.type == 'Current'){
        return makeMarker(feature,'C')
    } else {
        return makeMarker(feature,'H')
    }
}

const dataLayer = L.geoJSON(data, {
    pointToLayer: dataMarker,
    attribution: ''
} ).bindPopup(function (layer) {
                 const contents = featurePopupContent(layer.feature)
              return contents;
    });

function filter () {
        var start = document.getElementById("start").value
        var end = document.getElementById("end").value
        try {
            dataLayer.removeFrom(map)
            
            dataLayer.filter = function(feature) {
            return (feature.properties.start) >= start & (feature.properties.end <= end)
                }
            dataLayer.addTo(map)
        } catch{
        }
    }
var midpoint = [54.66, -5.67 ];
var map = L.map('map', {
    center: midpoint,
    zoom: 6,
    // layers which are on by default
    layers: [tiles,]
    });		
// add Layer Control
var baseMaps = { 
                "OpenStreetMap" : tiles
              }
// available layers
var overLays = {}

// var layerControl = L.control.layers(baseMaps, overLays).addTo(map)