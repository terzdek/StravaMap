// Load Map
function init_map(){
    var map_obj = L.map('mapid').setView([45, 4], 5);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/outdoors-v11',
    accessToken: 'pk.eyJ1IjoiYWxhcnR5IiwiYSI6ImNqcnJuNjVrOTAzOHIzeW5wa3hjeThkbnkifQ.BErXSZMg3xOUBFDB5RvQ7w'
    }).addTo(map_obj);
    var sidebar = L.control.sidebar('sidebar').addTo(map_obj);
    sidebar.open("home")
    return map_obj
}

function remove_layer(id){
    map_obj.removeLayer(get_layer_from_id(id))
}

function add_layer(layer){
    layer.addTo(map_obj)
}

function show_activities_on_map(){
    // show polylines
    for (var i = 0; i < g_polyline_list.length; i++) {
        add_layer(g_polyline_list[i])
    }
    // fit the map window to contain all the activities
    map_obj.fitBounds(get_coord_bound_list(g_polyline_list))
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
            return 'green'
        case 'NordicSki':
            return 'green'
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
            return layer
        }
    }
    return null
}

function click_on_layer(id){
    get_layer_from_id(id).fire('click')
}

