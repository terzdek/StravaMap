// What to do onload of page
function init(){

    init_ui()

    map_obj = init_map()
    // store the polylines of the map
    g_polyline_list = []
    // store the json associated activities, output of Strava
    g_activity_list = []

    // store the ids filtered by checkboxes
    g_filtered_checkbox_list = []
    // store the ids filtered by datepicker
    g_filtered_datepicker_list = []

    var flag_access_granted = 0
    var access_token = get_cookie('access_token')
    
    // If no cookie exist
    if (access_token == ""){
        console.log("no cookie access token")
        var args = get_args()
        console.log(args)
        if ('code' in args){
            get_token(args['code'])
            flag_access_granted = 1
        }else if('access_token' in args){
            console.log('We have the token :' + args)
        }else{
            console.log("Please connect")
        }
    }else{
        flag_access_granted = 1
    }

    if (flag_access_granted == 1){
        load_content_from_token(map_obj)
    }


}

init()
