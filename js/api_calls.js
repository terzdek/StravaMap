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

function concat_localStorage(key, content) {
    var old = localStorage.getItem(key)
    if (old === null) {
        localStorage.setItem(key, content);
    } else {
        localStorage.setItem(key, JSON.stringify(JSON.parse(old).concat(JSON.parse(content))))
    }
}

// Get activities from Strava, plot them and put into the list
function load_activities(id, map){
    access_token = get_cookie("access_token")
    var per_page = 200
    var page_nb = 1
    // timestamp in second
    now = Date.now() / 1000
    params = {'before':now, 'after':1264365861, 'page':page_nb, 'per_page':per_page, 'access_token': access_token}
    add_loader()

    display_act = function(json){
        show_activities_on_map(json)
        show_activities_on_list(json)
        set_cookie("activities", json, 100)
        remove_loader()
    }

    load_several_pages = async function(json){
        if (json != ""){
            concat_localStorage('activities', json)
            if(JSON.parse(json).length === per_page){
                page_nb += 1
                params['page'] = page_nb
                params['per_page'] = per_page
                get_api("athlete/activities", params, load_several_pages)
            } else{
                display_act(localStorage.getItem('activities'))
            }
        }


    }
    var local_activities = localStorage.getItem('activities')
    if (local_activities == null){
        get_api("athlete/activities", params, load_several_pages)
    }else{
        display_act(local_activities)
    }
}