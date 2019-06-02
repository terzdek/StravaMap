
// Delete the two token cookies
function delete_cookies(){
    set_cookie("access_token", "", 0)
    set_cookie("refresh_token", "", 0)
    set_cookie("activities", "", 0)
    set_cookie("user", "", 0)
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

// transform a number into a color (with min/max number of range)
function perc2color(perc,min,max) {
    var base = (max - min)

    if (base == 0) { perc = 100 }
    else {
        perc = (perc - min) / base * 100
    }
    var r, g, b = 0
    if (perc < 50) {
        r = 255
        g = Math.round(5.1 * perc)
    }
    else {
        g = 255
        r = Math.round(510 - 5.10 * perc)
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1
    return '#' + ('000000' + h.toString(16)).slice(-6)
}