
// Redirect to strava Oauth site to get access code. Then redirect back to homepage
function OauthRedirect() {
    params = {
        'client_id':'32029',
        'redirect':'http://localhost/StravaMap', 
        'approval_prompt':'auto',
        'response_type':'code',
        'scope':"read,activity:read_all,profile:read_all,read_all"
    }

    window.location.assign("http://www.strava.com/oauth/authorize?" + 
        "client_id=" + params['client_id'] +
        "&response_type="+ params['response_type'] +
        "&redirect_uri="+ params['redirect']  +
        "&approval_prompt="+ params['approval_prompt']  +
        "&scope=" + params['scope'])
}

// Delete the two token cookies
function delete_cookies(){
    set_cookie("access_token", "", 0)
    set_cookie("refresh_token", "", 0)
}

// remove cookies and reload
function disconnect(){
    delete_cookies()
    window.location.assign('http://localhost/StravaMap')
}

// Get token with and save it
function get_token(code){
    params = {
        'code': code,
        'client_id':'32029',
        'client_secret':'0565c2ccd75607aad3a021fd6d90b33a31a823f8',
        'grant_type': "authorization_code"
    }

    // set cookie of the two tokens and reload page
    set_token_cookie = function(json){
        json = JSON.parse(json)
        set_cookie("access_token", json["access_token"], json["expires_at"])
        set_cookie("refresh_token", json["refresh_token"], json["expires_at"]*2)
        location.reload()
    }
    // Post + Callback
    res = post_api('token', params, set_token_cookie, 'https://www.strava.com/oauth/')
}

// get arguments as dict from URL
function get_args(){
    var query = window.location.search.substring(1).split("&")
    var get_attrs = {}
    for (i=0; i<query.length; i++){
        tmp = query[i].split("=")
        get_attrs[tmp[0]] = tmp[1]
    }
    return get_attrs
}

// get the needed cookie 
function get_cookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function set_cookie(cname, cvalue, exdays) {
  var expires = "expires="+ exdays;
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// perform a get api call
function get_api(type, params, callback=function(json){},fullurl='https://www.strava.com/api/v3/'){
    var req = new XMLHttpRequest();
    url = fullurl + type + '?'
    $.each(params, function( k, v ) {
        url += k +"=" + v + "&"
    })
    console.log("GET " + url)
    req.open('GET', url, true);

    req.onreadystatechange = function() {
        if(req.readyState === 4){     
            if(req.status == 200) {
                callback(req.responseText)
            }else{
                console.log("Error during " + url)
                console.log("Status de la réponse: %d (%s)", req.status, req.statusText)
            }
        }   
    }

    req.send()
}

// perform a get api call
function post_api(type, params, callback=function(json){}, fullurl='https://www.strava.com/api/v3/'){
    var req = new XMLHttpRequest();
    url = fullurl + type + '?'
    $.each(params, function( k, v ) {
        url += k +"=" + v + "&"
    })
    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function() {
        if(req.readyState === 4){     
            if(req.status == 200) {
                callback(req.responseText)
            }else{
                console.log("Error during " + url)
                console.log("Status de la réponse: %d (%s)", req.status, req.statusText)
            }
        }   
    }

    req.send(params)
}

// Called when we have the user token
function load_infos(map){

    // Change button Connect to Disconnect
    $("#btnAuthenticate").html("Disconnect").on('click', (e) => {disconnect()})

    token = get_cookie("access_token")

    print_athlete = function(json){
        if (json != ""){
            json = JSON.parse(json)
            console.log(json)
            $('#infos').append(json["firstname"] + " " + json["lastname"])
            $('#infos').append(
                $('<button/>').addClass('btn btn-outline-primary').text('Load activities').attr('id', 'activities').click(function () { 
                    load_activities(json["id"], map)
                }))
        }
    }
    get_api('athlete', {"access_token":token}, print_athlete)
}

// Get activities from Strava, plot them and put into the list 
// TODO : Need refacto
function load_activities(id, map){
    access_token = get_cookie("access_token")
    // timestamp in second
    now = Date.now() / 1000
    params = {'before':now, 'after':1264365861, 'page':1, 'per_page':200, 'access_token': access_token}
    print_activities = function(json){
        if (json != ""){
            json = JSON.parse(json)
            for (var i = 0; i < json.length; i++) {
                polyline = json[i].map.summary_polyline
                if (polyline != null){

                    var coordinates = L.Polyline.fromEncoded(polyline).getLatLngs();

                    L.polyline(
                      coordinates,
                      {
                          color: 'blue',
                          weight: 2,
                          opacity: .7,
                          lineJoin: 'round'
                      }
                    ).addTo(map);
                }
            }
            $('#activities').text('See activities list').unbind('click').attr('data-toggle', 'modal').attr('data-target', '#ModalLong').click(function () { display_list(json) })

        }
    }
    get_api("athlete/activities", params, print_activities)

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

    //when flag 1, can compute infos
    flag = 0
    access_token = get_cookie('access_token')
    
    // If no cookie exist
    if (access_token == ""){
        args = get_args()
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
