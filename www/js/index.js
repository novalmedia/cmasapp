
/* window.onNotificationGCM =  function(e) {
	switch( e.event )
	{
		case 'registered':
			if ( e.regid.length > 0 )
			{
				var uid = window.localStorage["userid"];
				$.post("http://www.clubmascodin.com/app/savegcm.php", {userid:uid,gcmkey:e.regid}, function(res) {
					if (res==0){
						/*navigator.notification.alert("Identificación correcta", function() {});*/
						/* window.location = "bienvenido.html";
					} else {
						window.location = "chgpwd.html";
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
}  */ 

function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

function checkPreAuth() {
	var form = $("#loginForm");
	if(window.localStorage.getItem("username") != null && window.localStorage.getItem("password") != null) {
		$("#username", form).val(window.localStorage.getItem("username"));
		$("#password", form).val(window.localStorage.getItem("password"));
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
				window.localStorage.setItem("username", u);
				window.localStorage.setItem("password", p);
				window.localStorage.setItem("userid", res["id"]);
				window.localStorage.setItem("socio", res["username"]);
				window.localStorage.setItem("name", res["name"]);
				window.localStorage.setItem("email", res["email"]);
				
				window.localStorage.setItem("birthDate", res["birthDate"]);
				window.localStorage.setItem("address1", res["address1"]);
				window.localStorage.setItem("city", res["city"]);
				window.localStorage.setItem("postal_code", res["postal_code"]);
				window.localStorage.setItem("phone", res["phone"]);
				
				window.localStorage.setItem("mensajes", res["mensajes"]);
				window.localStorage.setItem("recordatorios", res["recordatorios"]);
				window.localStorage.setItem("citas", res["citas"]);
				window.localStorage.setItem("citatext", res["citatext"]);
				
				window.localStorage.setItem("messages", '');
				//window.localStorage["userdata"] = res;
				/* var pushNotification = window.plugins.pushNotification;
				pushNotification.register(successHandler, errorHandler,{"senderID":"349344466742","ecb":"onNotificationGCM"}); */
				push.unregister(
				  () => {
					console.log('success');
				  },
				  () => {
					console.log('error');
				  }
				);
				window.location = "bienvenido.html";
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
	
	const push = PushNotification.init({
		android: {
			"senderID": "349344466742"
		},
		browser: {
			pushServiceURL: 'http://push.api.phonegap.com/v1/push'
		}
	});

	push.on('registration', function(data){
		// data.registrationId
		if ( data.registrationId.length > 0 &&  data.registrationId != window.localStorage.getItem("gcmkey"))
			{
				window.localStorage.setItem("gcmkey",data.registrationId);
				var uid = window.localStorage.getItem("userid");
				if (uid != null){
					$.post("http://www.clubmascodin.com/app/savegcm.php", {userid:uid,gcmkey:data.registrationId}, function(res) {
						if (res==0){
							/*navigator.notification.alert("Identificación correcta", function() {});*/
							//window.location = "bienvenido.html";
						} else {
							//window.location = "chgpwd.html";
						}
					},"json");
				}
			}
	});

	push.on('notification',function(data) {
		
	});

	push.on('error',function(e) {
		
	});
	
}



function errorHandler(error) {
	console.log(error);
}


function successHandler(result) {
	console.log('Callback Success! Result = '+result)
}


