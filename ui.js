// From the user token, save/print it infos
function load_infos(map){

    // Change button Connect to Disconnect
    $("#btnAuthenticate").html("Disconnect").on('click', (e) => {disconnect()})

    token = get_cookie("access_token")

    save_ath_and_print = function(content){
        set_cookie("user", content, 100)
        print_athlete(content)
    }

    get_api('athlete', {"access_token":token}, save_ath_and_print)

}

// print in the navbar the information of the user
function print_athlete(content){
    if (content != ""){
        content = JSON.parse(content)
        console.log(content)
        $('#infos').append(content["firstname"] + " " + content["lastname"])
        $('#infos').append(
            $('<button/>').addClass('btn btn-outline-primary').text('Load activities').attr('id', 'activities').click(function () { 
                load_activities(content["id"], map)
            }))
        load_activities(content["id"], map)
    }
}

// Get activities from Strava, plot them and put into the list 
function load_activities(id, map){
    access_token = get_cookie("access_token")
    // timestamp in second
    now = Date.now() / 1000
    params = {'before':now, 'after':1264365861, 'page':1, 'per_page':200, 'access_token': access_token}


    save_and_display_act = function(json){
        display_activities(json)
        set_cookie("activities", json, 100)
    }
    get_api("athlete/activities", params, display_activities)

}

function display_activities(content){
    if (content != ""){
        content = JSON.parse(content)
        var coordinates_list = []
        var selected_polyline
        for (var i = 0; i < content.length; i++) {
            var current_activity = content[i]
            polyline = current_activity.map.summary_polyline
            p = polyline
            if (polyline != null){
                // add each activity to map
                var coordinates = L.Polyline.fromEncoded(polyline).getLatLngs();
                coordinates_list.push(coordinates)
                color = perc2color(i, content.length, 0)
                L.polyline(
                  coordinates,
                  {
                      color: color,
                      weight: 4,
                      opacity: .7,
                      lineJoin: 'round',
                  }
                ).on('click', function(e){
                    onclick_poly(e, selected_polyline)
                    selected_polyline = e
                }).bindPopup(act_toHTMLString(content[i])
                ).addTo(map);

            }
        }
        // fit the map window to contain all the activities
        map.fitBounds(coordinates_list)
        // Display button
        $('#activities').text('See activities list').unbind('click').attr('data-toggle', 'modal').attr('data-target', '#ModalLong').click(function () { display_list(content) })

    }
}

function onclick_poly(e, previous){
    var layer = e.target
    layer.setStyle({
        weight: 8,
        color: 'red'
    })
    if (previous){
        previous.target.setStyle({
        weight: 4,
        color: 'blue'
    })
    }
}

function act_toHTMLString(activity){
    console.log(activity)
    moving_time = new Date(1000 * activity['moving_time']).toISOString().substr(11, 8) 
    distance = Math.round(activity['distance'] / 100).toFixed(1)
    str = activity['name'] + '<br/>'
    str += 'Date : ' + activity['start_date_local'].substring(0,10) + '<br/>'
    str += 'Distance : ' + distance + 'km <br/>'
    str += 'Duration : ' + moving_time + '<br/>'
    if (activity['type'] == 'Run'){
        str += 'Elevation gain : ' + activity['total_elevation_gain'] + 'D+'
    }
    return str
}

// list of activities
function display_list(json){

    txt = "<table class='table'>"
    txt += "<thead>"
    txt += "<tr>"
    txt += "<th scope='col'>Name</th>"
    txt += "<th scope='col'>Sport</th>"
    txt += "<th scope='col'>Average Speed</th>"
    txt += "<th scope='col'>Distance</th>"
    txt += "<th scope='col'>Date</th>"
    txt += "<th scope='col'>Elapsed Time</th>"
    txt += "<th scope='col'>Kudos</th>"
    txt += "</tr>"
    txt += "</thead>"
    for (x in json) {
        txt += "<tbody>"
        txt += "<tr>"
        txt += "<th scope='row'>" + json[x].name + "</th>"
        txt += "<td>" + json[x].type + "</td>"
        txt += "<td>" + json[x].average_speed + "</td>"
        txt += "<td>" + json[x].distance + "</td>"

        date = new Date(json[x].start_date).toLocaleDateString('fr-FR')

        txt += "<td>" + date + "</td>"
        txt += "<td>" + json[x].elapsed_time + "</td>"
        txt += "<td>" + json[x].kudos_count + "</td>"
        txt += "</tr>"
        txt += "</tbody>"
    }
    txt += "</table>"

    $('.modal-body').html(txt)
}


// Load Map
function init_map(){
    var map = L.map('mapid').setView([45, 4], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWxhcnR5IiwiYSI6ImNqcnJuNjVrOTAzOHIzeW5wa3hjeThkbnkifQ.BErXSZMg3xOUBFDB5RvQ7w'
    }).addTo(map);

    return map
}

// What to do onload of page
function init(){

    //set the btn a function
    $("#btnAuthenticate").on('click', (e) => {
        OauthRedirect()
    })

    map = init_map()
    p = null

    //when flag 1, can compute infos
    flag = 0
    access_token = get_cookie('access_token')
    
    // If no cookie exist
    if (access_token == ""){
        console.log("no cookie access token")
        args = get_args()
        console.log(args)
        if ('code' in args){
            get_token(args['code'])
            flag = 1
        }else if('access_token' in args){
            console.log('We have the token :' + args)
        }else{
            console.log("Please connect")
        }
    }else{
        flag = 1
    }


    if (flag == 1){
        load_infos(map)
    }


}

init()
