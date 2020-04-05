///////////////////////////////
//LOAD CONTENT FROM API CALLS//
///////////////////////////////

// From the user token, save cookie and load/print content
function load_content_from_token(map){
    $("#btnAuthenticate").remove()
    // Change button Connect to Disconnect
    $("#btnDisconnect").html("Disconnect").on('click', (e) => {disconnect()})

    token = get_cookie("access_token")
    save_auth_and_load = function(content){
        set_cookie("user", content, 100)
        if (content != "") {
            content = JSON.parse(content)
            print_athlete_infos(content)
            load_activities(content["id"], map_obj)
        }
    }
    get_api('athlete', {"access_token":token}, save_auth_and_load)
}

// Get activities from Strava, plot them and put into the list
function load_activities(id, map){
    access_token = get_cookie("access_token")
    // timestamp in second
    now = Date.now() / 1000
    params = {'before':now, 'after':1264365861, 'page':1, 'per_page':200, 'access_token': access_token}
    console.log("LOADING....")
    add_loader()
    var activities = localStorage.getItem('activities')

    save_and_display_act = function(json){
        if (localStorage.getItem('activities') == null){
            localStorage.setItem('activities', json)
        }
        show_activities_on_map(json)
        show_activities_on_list(json)
        set_cookie("activities", json, 100)
        remove_loader()

    }
    if (activities == null){
        get_api("athlete/activities", params, save_and_display_act)
    }else{
        save_and_display_act(activities)
    }
}