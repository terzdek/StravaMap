// Load Map
function init_map(){
    var map_obj = L.map('mapid').setView([45, 4], 5);
    L.tileLayer('https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}.png?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/outdoors-v11',
    accessToken: 'pk.eyJ1IjoiYWxhcnR5ODkiLCJhIjoiY2tuNWN1ZDh2MDJ5bDJ2bjFoOXl2NXFlMyJ9.29nOGkq8SrTmR_MTyJvK9Q'
    }).addTo(map_obj);
    var sidebar = L.control.sidebar('sidebar').addTo(map_obj);
    sidebar.open("home")
    return map_obj
}

function hide_layer_by_id(id){
    layer = get_layer_from_id(id)
    if (layer == null){
        console.log("Unable to hide layer " + id + ", layer not found. Must be a activity without GPS")
    } else{
        map_obj.removeLayer(layer)
    }
}

function show_layer_by_id(id){
    layer = get_layer_from_id(id)
    if (layer == null){
        console.log("Unable to show layer " + id + ", layer not found. Must be a activity without GPS")
    } else{
        layer.addTo(map_obj)
    }
}

function show_layer(layer){
    layer.addTo(map_obj)
}
function show_activities_on_map(){
    // show polylines
    for (var i = 0; i < g_polyline_list.length; i++) {
        show_layer(g_polyline_list[i])
    }
    // fit the map window to contain all the activities
    map_obj.fitBounds(get_coord_bound_list(g_polyline_list))
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
    for (const [key, layer] of Object.entries(g_polyline_list)) {
        if (layer.options.id == id){
            return layer
        }
    }
    return null
}

function click_on_layer(id){
    get_layer_from_id(id).fire('click')
}

