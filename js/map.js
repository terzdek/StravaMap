// Load Map
function init_map(){
    var map_obj = L.map('mapid').setView([45, 4], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWxhcnR5IiwiYSI6ImNqcnJuNjVrOTAzOHIzeW5wa3hjeThkbnkifQ.BErXSZMg3xOUBFDB5RvQ7w'
    }).addTo(map_obj);
    var sidebar = L.control.sidebar('sidebar').addTo(map_obj);
    sidebar.open("home")
    return map_obj
}

function show_activities_on_map(content){
    if (content != ""){
        content = JSON.parse(content)
        var coordinates_list = []
        var last_polyline
        for (var i = 0; i < content.length; i++) {
            var current_activity = content[i]
            var polyline = current_activity.map.summary_polyline
            if (polyline != null){
                // add each activity to map
                var coordinates = L.Polyline.fromEncoded(polyline).getLatLngs();
                coordinates_list.push(coordinates)
                L.polyline(
                    coordinates,
                    {
                        color: unique_color_for_sport(content[i].type),
                        weight: 4,
                        opacity: .7,
                        lineJoin: 'round',
                        id:i
                    }
                ).on('click', function(e){
                    onclick_poly(e, last_polyline)
                    last_polyline = e
                }).bindPopup(activity_toHTMLString(content[i])
                ).addTo(map_obj);

            }
        }
        // fit the map window to contain all the activities
        map_obj.fitBounds(coordinates_list)
    }
}

function unique_color_for_sport(sport_name){
    switch (sport_name) {
        case 'Run':
            return 'red'
        case 'Snowshoe':
            return 'red'
        case 'Hike':
            return 'red'
        case 'Walk':
            return 'red'
        case 'Ride':
            return 'blue'
        case 'AlpineSki':
            return 'grey'
        case 'NordicSki':
            return 'grey'
        case 'BackcountrySki':
            return 'green'
        case 'Swim':
            return 'yellow'
        default:
            return 'grey'
    }
}

function onclick_poly(e, previous){
    // Thicken the clicked poly
    if (previous){
        previous.target.setStyle({weight: 4})
    }
    e.target.setStyle({weight: 8})

    // fit map to clicked poly
    map_obj.fitBounds(e.target.getLatLngs())
}

function get_layer_from_id(id){
    for (const [key, layer] of Object.entries(map_obj._layers)) {
        if (layer.options.id == id){
            console.log(layer)
            return layer
        }
    }
    return null
}

function click_on_layer(id){
    get_layer_from_id(id).fire('click')
}