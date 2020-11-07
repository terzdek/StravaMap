////////////////////////////////
//FROM LOADED CONTENT, DISPLAY//
////////////////////////////////

// print in the navbar the information of the user and load activities
function print_athlete_infos(content){
    $('#home>.sidebar-header').append("of " + content["firstname"] + " " + content["lastname"])
}

function show_activities_on_list(content) {
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
    if (content != ""){
        content = JSON.parse(content)
        txt += "<tbody>"
        for (var i = 0; i < content.length; i++) {
            var trigger_correspond_layer = "click_on_layer(" + i + ")"

            txt += "<tr>"
            txt += "<th scope='row'><a href=javascript:" + trigger_correspond_layer + ";>" + content[i].name + "</a></th>"
            txt += "<td>" + content[i].type + "</td>"
            date = new Date(content[i].start_date).toLocaleDateString('fr-FR')
            txt += "<td>" + date + "</td>"
            distance = Math.round((content[i].distance / 1000 + Number.EPSILON) * 100) / 100
            txt += "<td>" + distance + "km</td>"
            elapsed_time = new Date(content[i].moving_time * 1000).toISOString().substr(11, 8);
            txt += "<td>" + elapsed_time + "</td>"
            txt += "<td>" + Math.round((content[i].average_speed * 3.6 + Number.EPSILON) * 100) / 100 + "km/h</td>"
            txt += "<td>" + content[i].kudos_count + "</td>"
            txt += "</tr>"
        }
        txt += "</tbody>"

    }
    txt += "</table>"

    $('#activity_list').html(txt)

}

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
        txt += "<input type='checkbox' id='" + activity_types[i] + "' name='" + activity_types[i] + "' value='" + activity_types[i] + "' onchange='activity_type_checkbox_action(this)' checked>\n"
        txt +="<label for='" + activity_types[i] + "'>" + activity_types[i] + "</label><br>\n"
    }
    $('#activity_chooser').html(txt)
}

function add_loader() {
    $("#home").append("<div class='loader'></div>")
}

function remove_loader() {
    $("#home>.loader").remove()
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

// What to do onload of page
function init_ui(){

    //Assign function to the button
    $("#btnAuthenticate").on('click', (e) => {
        OauthRedirect()
    })

}
