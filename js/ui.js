////////////////////////////////
//FROM LOADED CONTENT, DISPLAY//
////////////////////////////////

////// SIDEBAR 
function print_athlete_infos(content){
    $('#home>.sidebar-header>p').append(" - " + content["firstname"] + " " + content["lastname"] + " (<span id='total_act_nb'>" + 0 + "</span> activities)")
}

//// LIST 

function update_total_activities_nb(){
    // add count in header of the sidebar before
    $('#total_act_nb').html(count_shown_activities())
}

function show_activities_on_list() {
    update_total_activities_nb()

    columns_to_add = ["Name", "Sport", "Date", "Distance", "Moving Time", "Average Speed", "Kudos Received"]

    txt = "<table class='table' id='table_sortable'>"
    txt += "<thead class='sticky_thead'>"
    txt += "<tr>"
    for (var i = 0; i < columns_to_add.length; i++) {
        txt += "<th scope='col' onclick='sort_table_by_col("+i+")'>" + columns_to_add[i] + "</th>"
    }
    txt += "</tr>"
    txt += "</thead>"
    txt += "<tbody>"
    txt += "</tbody>"
    txt += "</table>"

    $('#activity_list').html(txt)

    for (var i = 0; i < g_activity_list.length; i++) {
        add_list_row('#activity_list>table>tbody', g_activity_list[i], i)
    }
}

function hide_list_line(id){
    $("#list_act_"+ id).hide();
}

function show_list_line(id){
    $("#list_act_"+ id).show();
}

function add_list_row(table_class, activity, id){
        date = new Date(activity.start_date).toLocaleDateString('fr-FR')
        distance = Math.round((activity.distance / 1000 + Number.EPSILON) * 100) / 100
        elapsed_time = new Date(activity.moving_time * 1000).toISOString().substr(11, 8)
        average_speed = Math.round((activity.average_speed * 3.6 + Number.EPSILON) * 100) / 100
        row_txt = "<tr id='" + "list_act_" + id + "'>"
        row_txt += "<td scope='row'><a href=javascript:" + "click_on_layer(" + id + ")" + ";>" + activity.name + "</a></td>"
        row_txt += "<td>" + activity.type + "</td>"
        row_txt += "<td>" + date + "</td>"
        row_txt += "<td>" + distance + "km</td>"
        row_txt += "<td>" + elapsed_time + "</td>"
        row_txt += "<td>" + average_speed + "km/h</td>"
        row_txt += "<td>" + activity.kudos_count + "</td>"
        row_txt += "</tr>"
        $(table_class).append(row_txt)
}

//// FILTERS

function show_filters(){
    show_datepicker()
    show_checkboxes_activity_type()
}

function show_datepicker() {
    $("#filters").show();
}

function activity_type_checkbox_action(checkbox_element){
    if (checkbox_element.checked) {
        show_type(checkbox_element.value)
    } else {
        hide_type(checkbox_element.value)
    }
    update_total_activities_nb()
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
            return 'green'
        case 'VirtualRide':
        case 'VirtualRun':
            return 'teal'
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
            return 'blue'
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

    //set datepicker to pick only years and months
    $('.input-daterange input').each(function() {
        $(this).datepicker({
            format: "mm-yyyy",
            startView: "months", 
            minViewMode: "months",
            autoclose: true
        });
        
    });
}
