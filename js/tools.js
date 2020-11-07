function main_callback(json){
    const [polyline_list, coordinates_list] = get_activities_polylines(json)
    g_polyline_list = polyline_list
    g_coordinates_list = coordinates_list
    show_activities_on_map()
    show_checkboxes_activity_type()
    show_activities_on_list(json)
    set_cookie("activities", json, 100)
    remove_loader()
}

function get_activities_polylines(content){
    if (content != ""){
        content = JSON.parse(content)
        var coordinates_list = []
        var polyline_list = []
        var last_polyline
        for (var i = 0; i < content.length; i++) {
            var polyline = content[i].map.summary_polyline
            if (polyline != null){
                // add each activity to map
                var coordinates = L.Polyline.fromEncoded(polyline).getLatLngs();
                coordinates_list.push(coordinates)
                p = L.polyline(
                    coordinates,
                    {
                        color: unique_color_for_sport(content[i].type),
                        weight: 4,
                        opacity: .7,
                        lineJoin: 'round',
                        id:i, 
                        activity_type:content[i].type
                    }
                ).on('click', function(e){
                    onclick_poly(e, last_polyline)
                    last_polyline = e
                }).bindPopup(activity_toHTMLString(content[i])
                )
                polyline_list.push(p)

            }
        }
        return [polyline_list, coordinates_list]
    }
    return null, null
}

function get_coord_bound_list(poly_list){
    var coordinates_list = []
    for (var i = 0; i < g_polyline_list.length; i++) {
        coordinates_list.push(g_polyline_list[i]._bounds._southWest)
        coordinates_list.push(g_polyline_list[i]._bounds._northEast)
    }
    return coordinates_list
}

function get_activities_types(){
    var activity_type = []
    for (var i = 0; i < g_polyline_list.length; i++) {
        current_type = g_polyline_list[i]["options"]["activity_type"]
        if (!activity_type.includes(current_type)){
            activity_type.push(current_type)
        }
    }
    return activity_type
}

function get_activities_id_by_type(type){
    activities_ids = []
    for (var i = 0; i < g_polyline_list.length; i++) {
        if (g_polyline_list[i]["options"]["activity_type"] == type){
            activities_ids.push(g_polyline_list[i]["options"]["id"])
        }
    }
    return activities_ids
}

function get_activities_by_type(type){
    activities = []
    for (var i = 0; i < g_polyline_list.length; i++) {
        if (g_polyline_list[i]["options"]["activity_type"] == type){
            activities.push(g_polyline_list[i])
        }
    }
    return activities
}

function hide_type(type){
    ids_to_remove = get_activities_id_by_type(type)
    for (var i = 0; i < ids_to_remove.length; i++) {
        remove_layer(ids_to_remove[i])
        //remove_list_line(ids_to_remove[i])
    }
}

function show_type(type){
    ids_to_add = get_activities_by_type(type)
    for (var i = 0; i < ids_to_add.length; i++) {
        add_layer(ids_to_add[i])
        //add_list_line(ids_to_add[i])
    }
}
