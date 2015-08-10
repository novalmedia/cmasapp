function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

function checkPreAuth() {
	var form = $("#loginForm");
	if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
		$("#username", form).val(window.localStorage["username"]);
		$("#password", form).val(window.localStorage["password"]);
		handleLogin();
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
			if(res == true) {
				//store
				window.localStorage["username"] = u;
				window.localStorage["password"] = p;
				var pushNotification = window.plugins.pushNotification;
				pushNotification.register(successHandler, errorHandler,{"senderID":"349344466742","ecb":"onNotificationGCM"});

			} else {
				navigator.notification.alert("Error de identificación", function() {});
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
	$("#loginForm").on("submit",handleLogin);
}



function errorHandler(error) {
	alert(error);
}
function successHandler(result) {
	alert('Callback Success! Result = '+result)
}
function onNotificationGCM(e) {
	switch( e.event )
	{
		case 'registered':
			if ( e.regid.length > 0 )
			{
				console.log("Regid " + e.regid);
				alert('registration id = '+e.regid);
			}
			break;
		case 'message':
			alert('message = '+e.message+' msgcnt = '+e.msgcnt);
			break;
		case 'error':
			alert('GCM error = '+e.msg);
			break;
		default:
			alert('An unknown GCM event has occurred');
			break;
	}
}
