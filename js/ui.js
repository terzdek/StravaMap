////////////////////////////////
//FROM LOADED CONTENT, DISPLAY//
////////////////////////////////

////// SIDEBAR 
function print_athlete_infos(content){
    $('#home>.sidebar-header>p').append(" - " + content["firstname"] + " " + content["lastname"])
}

//// LIST 

function show_activities_on_list() {
    // add count in header of the sidebar before
    $('#home>.sidebar-header>p').append(" (" + count_activities() + " activities)")


    txt = "<table class='table'>"
    txt += "<thead class='sticky_thead'>"
    txt += "<tr>"
    txt += "<th scope='col'>Name</th>"
    txt += "<th scope='col'>Sport</th>"
    txt += "<th scope='col'>Date</th>"
    txt += "<th scope='col'>Distance</th>"
    txt += "<th scope='col'>Moving Time</th>"
    txt += "<th scope='col'>Average Speed</th>"
    txt += "<th scope='col'>Kudos Received</th>"
    txt += "</tr>"
    txt += "</thead>"
    txt += "<tbody>"
    for (var i = 0; i < g_activity_list.length; i++) {
        txt += "<tr id='" + "list_act_" + i + "'>"
        txt += "<th scope='row'><a href=javascript:" + "click_on_layer(" + i + ")" + ";>" + g_activity_list[i].name + "</a></th>"
        txt += "<td>" + g_activity_list[i].type + "</td>"
        date = new Date(g_activity_list[i].start_date).toLocaleDateString('fr-FR')
        txt += "<td>" + date + "</td>"
        distance = Math.round((g_activity_list[i].distance / 1000 + Number.EPSILON) * 100) / 100
        txt += "<td>" + distance + "km</td>"
        elapsed_time = new Date(g_activity_list[i].moving_time * 1000).toISOString().substr(11, 8);
        txt += "<td>" + elapsed_time + "</td>"
        txt += "<td>" + Math.round((g_activity_list[i].average_speed * 3.6 + Number.EPSILON) * 100) / 100 + "km/h</td>"
        txt += "<td>" + g_activity_list[i].kudos_count + "</td>"
        txt += "</tr>"
    }
    txt += "</tbody>"
    txt += "</table>"

    $('#activity_list').html(txt)

}

function hide_list_line(id){
    $("#list_act_"+ id).css("display","none")
}

function show_list_line(id){
    $("#list_act_"+ id).css("display","")
}

//// CHECKBOXES

function activity_type_checkbox_action(checkbox_element){
    if (checkbox_element.checked) {
        show_type(checkbox_element.value)
    } else {
        hide_type(checkbox_element.value)
    }
}

function show_checkboxes_activity_type(){
    activity_types = get_activities_types_and_count()
    txt = ""
    for (var i = 0; i < activity_types.length; i++) {
        act = activity_types[i][0]
        act_count = activity_types[i][1]
        if (i % 2 == 0){
            txt += "<div class='row'>"
        }
        txt += "<div class='col'>"
        txt += "<label for='" + act + "' class='checkbox-inline' style='color:"+ unique_color_for_sport(act) +"'>"
        txt += "<input type='checkbox' id='" + act + "' name='" + act + "' value='" + act + "' onchange='activity_type_checkbox_action(this)' checked>\n"
        txt += act + " ("+ act_count +")</label>\n"
        txt += "</div>\n"
        if (i % 2 == 1){
            txt += "</div>\n"
        }
        // to close div row even when odd number of types
        if (i == activity_types.length & activity_types.length % 2 == 1){
            txt += "</div>\n"
        }
    }
    $('#activity_chooser').html(txt)
}

//// LOADER

function add_loader() {
    $("#home").append("<div class='loader'></div>")
}

function remove_loader() {
    $("#home>.loader").remove()
}

// general ui
function unique_color_for_sport(sport_name){
    switch (sport_name) {
        case 'Run':
            return 'red'
        case 'Hike':
        case 'Snowshoe':
        case 'Walk':
            return 'orange'
        case 'Ride':
        case 'EBikeRide':
            return 'blue'
        case 'VirtualRide':
        case 'VirtualRun':
            return 'cyan'
        case 'AlpineSki':
        case 'BackcountrySki':
        case 'NordicSki':
        case 'Windsurf':
        case 'Snowboard':
            return 'purple'
        case 'Swim':
        case 'Kayaking':
        case 'Kitesurf':
        case 'Sail':
        case 'Rowing':
        case 'Canoeing':
            return 'green'
        case 'Crossfit':
        case 'Workout':
        case 'Wheelchair':
        case 'Handcycle':
        case 'Yoga':
        case 'WeightTraining':
        case 'Elliptical':
        case 'Skateboard':
        case 'IceSkate':
        case 'RollerSki':
        case 'RockClimbing':
        case 'InlineSkate':
        case 'Golf':
        default:
            return 'grey'
    }
}




// What to do onload of page
function init_ui(){

    //Assign function to the button
    $("#btnAuthenticate").on('click', (e) => {
        OauthRedirect()
    })

}
