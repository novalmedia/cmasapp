
window.onNotificationGCM =  function(e) {
	switch( e.event )
	{
		case 'registered':
			if ( e.regid.length > 0 )
			{
				var uid = window.localStorage["userid"];
				$.post("http://www.clubmascodin.com/app/savegcm.php", {userid:uid,gcmkey:e.regid}, function(res) {
					if (res==true){
						navigator.notification.alert("Identificación correcta", function() {});
						window.location = "datos.html";
					}
				},"json");
			}
			break;
		case 'message':
			console.log('message = '+e.message+' msgcnt = '+e.msgcnt);
			break;
		case 'error':
			console.log('GCM error = '+e.msg);
			break;
		default:
			console.log('An unknown GCM event has occurred');
			break;
	}
} 

function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

function checkPreAuth() {
	var form = $("#loginForm");
	if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
		$("#username", form).val(window.localStorage["username"]);
		$("#password", form).val(window.localStorage["password"]);
	}
}

function handleLogin() {
	var form = $("#loginForm");
	//disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val();
	console.log("click");
	if(u != '' && p!= '') {
		$.post("http://www.clubmascodin.com/app/auth.php", {username:u,password:p}, function(res) {
			if(res == false) {
				navigator.notification.alert("Error de identificación", function() {});
			} else {
				//store
				window.localStorage["username"] = u;
				window.localStorage["password"] = p;
				window.localStorage["userid"] = res["userdata"].id;
				window.localStorage["socio"] = res["userdata"].username;
				window.localStorage["name"] = res["userdata"].name;
				window.localStorage["email"] = res["userdata"].email;
				
				window.localStorage["birthDate"] = res["userprofile"].birthDate;
				window.localStorage["address1"] = res["userprofile"].address1;
				window.localStorage["city"] = res["userprofile"].city;
				window.localStorage["postal_code"] = res["userprofile"].postal_code;
				window.localStorage["phone"] = res["userprofile"].phone;
				window.localStorage["messages"] = '';
				//window.localStorage["userdata"] = res;
				var pushNotification = window.plugins.pushNotification;
				pushNotification.register(successHandler, errorHandler,{"senderID":"349344466742","ecb":"onNotificationGCM"});
				//window.location = "index.html";
			}
			$("#submitButton").removeAttr("disabled");
		},"json");
	} else {
	//Thanks Igor!
		navigator.notification.alert("Debes introducir tu numero de socio y contraseña", function() {});
		$("#submitButton").removeAttr("disabled");
	}
	return false;
}

function deviceReady() {
	$("#loginForm").submit(handleLogin);
	$("div:jqmData(role='panel')").css('margin-top',  ($("div:jqmData(role='header')").height()));
	if(window.localStorage["socio"] != undefined && window.localStorage["name"] != undefined) {
		$("#psocio").html(window.localStorage["socio"]);
		$("#pname").html(window.localStorage["name"]);
		$(".private").removeClass('private');
	}
}



function errorHandler(error) {
	console.log(error);
}


function successHandler(result) {
	console.log('Callback Success! Result = '+result)
}


