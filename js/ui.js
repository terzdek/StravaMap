////////////////////////////////
//FROM LOADED CONTENT, DISPLAY//
////////////////////////////////

////// SIDEBAR 
function print_athlete_infos(content){
    $('#home>.sidebar-header').append("of " + content["firstname"] + " " + content["lastname"])
}

//// LIST 

function show_activities_on_list() {
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
    activity_types = get_activities_types()
    txt = ""
    for (var i = 0; i < activity_types.length; i++) {
        if (i % 2 == 0){
            txt += "<div class='row'>"
        }
        txt += "<div class='col'>"
        txt += "<label for='" + activity_types[i] + "' class='checkbox-inline'>"
        txt += "<input type='checkbox' id='" + activity_types[i] + "' name='" + activity_types[i] + "' value='" + activity_types[i] + "' onchange='activity_type_checkbox_action(this)' checked>\n"
        txt += activity_types[i] + "</label>\n"
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

// What to do onload of page
function init_ui(){

    //Assign function to the button
    $("#btnAuthenticate").on('click', (e) => {
        OauthRedirect()
    })

}
