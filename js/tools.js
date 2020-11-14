function main_callback(json){
    set_cookie("activities", json, 100)
    
    act_list = get_activities(json)
    g_activity_list = act_list
    polyline_list = get_activities_polylines()
    g_polyline_list = polyline_list
    try {
        show_activities_on_map()
    }
    catch(err) {
        console.log("Error while showing activity on map : " + err)
    }
    try {
        show_filters()
    }
    catch(err) {
        console.log("Error while showing checkboxes to choose activities types : " + err)
    }

    show_activities_on_list()
    remove_loader()
}

function get_activities(content){
    if (content != ""){
        content = JSON.parse(content)
        var act_list = []
        for (var i = 0; i < content.length; i++) {
            act_list.push(content[i])
        }
        return act_list
    }
    return null
}


function activity_toHTMLString(activity){
    moving_time = new Date(1000 * activity['moving_time']).toISOString().substr(11, 8)
    distance = Math.round((activity.distance / 1000 + Number.EPSILON) * 100) / 100
    str = '<a href="https://www.strava.com/activities/' + activity['id'] + '" target="_blank">' + activity['name'] + '</a><br/>'
    str += 'Date : ' + activity['start_date_local'].substring(0,10) + '<br/>'
    str += 'Distance : ' + distance + 'km <br/>'
    str += 'Duration : ' + moving_time + '<br/>'
    if (activity['type'] == 'Run'){
        str += 'Elevation gain : ' + activity['total_elevation_gain'] + 'D+'
    }
    return str
}

function get_activities_polylines(content){
    var polyline_list = []
    var last_polyline
    for (var i = 0; i < g_activity_list.length; i++) {
        var polyline = g_activity_list[i].map.summary_polyline
        if (polyline != null){
            // add each activity to map
            var coordinates = L.Polyline.fromEncoded(polyline).getLatLngs();
            p = L.polyline(
                coordinates,
                {
                    color: unique_color_for_sport(g_activity_list[i].type),
                    weight: 4,
                    opacity: .7,
                    lineJoin: 'round',
                    id:i, 
                    activity_type:g_activity_list[i].type
                }
            ).on('click', function(e){
                onclick_poly(e, last_polyline)
                last_polyline = e
            }).bindPopup(activity_toHTMLString(g_activity_list[i])
            )
            polyline_list.push(p)

        }
    }
    return polyline_list
}

function get_coord_bound_list(poly_list){
    var coordinates_list = []
    for (var i = 0; i < g_polyline_list.length; i++) {
        coordinates_list.push(g_polyline_list[i]._bounds._southWest)
        coordinates_list.push(g_polyline_list[i]._bounds._northEast)
    }
    return coordinates_list
}

function get_activities_types_and_count(){
    var activity_type = []
    for (var i = 0; i < g_activity_list.length; i++) {
        activity_type.push(g_activity_list[i]["type"])
    }
    // count elements of each type
    var items = {};
    for (var i = 0; i < activity_type.length; i++) {
        items[activity_type[i]] = 1 + (items[activity_type[i]] || 0);
    }

    // sort elements by count
    items = Object.keys(items).map(function(key) {
        return [key, items[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    return items
}

function get_activities_id_by_type(type){
    ids = []
    for (var i = 0; i < g_activity_list.length; i++) {
        if (g_activity_list[i]["type"] == type){
            ids.push(i)
        }
    }
    return ids
}

function get_activities_id_out_of_daterange(date1, date2){
    ids = []
    for (var i = 0; i < g_activity_list.length; i++) {
        current_date = Date.parse(g_activity_list[i].start_date_local)
        if(current_date <= date1 || current_date >= date2){
            ids.push(i)
        }
    }
    return ids
}

function hide_type(type){
    ids_to_hide = get_activities_id_by_type(type)
    for (var i = 0; i < ids_to_hide.length; i++) {
        // if not already hidden by datepicker
        if (!g_filtered_datepicker_list.includes(ids_to_hide[i])) {
            hide_layer_by_id(ids_to_hide[i])
            hide_list_line(ids_to_hide[i])
            g_filtered_checkbox_list.push(ids_to_hide[i])
        }
    }
}

function show_type(type){
    ids_to_show = get_activities_id_by_type(type)
    for (var i = 0; i < ids_to_show.length; i++) {
        // if was hidden by checkbox only
        if (g_filtered_checkbox_list.includes(ids_to_show[i])) {
            show_layer_by_id(ids_to_show[i])
            show_list_line(ids_to_show[i])
            // remove item from array
            var index = g_filtered_checkbox_list.indexOf(ids_to_show[i]);
            if (index !== -1) {
              g_filtered_checkbox_list.splice(index, 1)
            }
        }
    }
}

function count_shown_activities(){
    // all activities except the filtered ones
    return g_activity_list.length - g_filtered_checkbox_list.length - g_filtered_datepicker_list.length
}

function sort_table_by_col(){
    console.log("sort_table_by_col : To Be Implemented")
}

// hide all date not in range of the two dates. If one date missing, 0 or inf value is taken
function filter_activities_by_date(){
    date1 = $("#date_begin")[0].value 
    date2 = $("#date_end")[0].value 
    if(date1 == ""){
        date_begin = Date.parse("1970-01-01")
    } else{
        date_begin = Date.parse(date1.substr(3) + "-" + date1.substr(0,2) + "-01")
    }
    if(date2 == ""){
        date_end = Date.parse("2999-01-01")
    } else{
        date_end = Date.parse(date2.substr(3) + "-" + date2.substr(0,2) + "-31")
    }
    if (date_begin > date_end){
        alert("Start date > End date")
        return
    }
    //show previous hidden ids by datepicker (to avoid showing the ones hidden by checkbox)
    for (var i = 0; i < g_filtered_datepicker_list.length; i++) {
        show_layer_by_id(g_filtered_datepicker_list[i])
        show_list_line(g_filtered_datepicker_list[i])
    }
    g_filtered_datepicker_list = []

    // hide new ones
    ids_to_hide = get_activities_id_out_of_daterange(date_begin, date_end)

    for (var i = 0; i < ids_to_hide.length; i++) {
        hide_layer_by_id(ids_to_hide[i])
        hide_list_line(ids_to_hide[i])
        g_filtered_datepicker_list.push(ids_to_hide[i])
    }

    update_total_activities_nb()

}
