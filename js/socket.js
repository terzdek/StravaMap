// Redirect to strava Oauth site to get access code. Then redirect back to homepage
function OauthRedirect() {
    params = {
        'client_id':'32029',
        'redirect':location.protocol + '//' + location.host + location.pathname,
        //'redirect' : "http://localhost/StravaMap",
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
    //var decodedCookie = decodeURIComponent(document.cookie)
    var ca = document.cookie.split(';')
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function set_cookie(cname, cvalue, exdays) {
    if (!(exdays instanceof Date)){
        var d = new Date()
        d.setTime(d.getTime() + (exdays*24*60*60*1000))
        var exdays = d.toUTCString()
    }
    var expires = "expires="+ exdays
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}