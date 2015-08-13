/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pageshow', this.onPageShow, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
	onPageShow: function() {
        alert('Received Event: ' + id);
		$("div:jqmData(role='panel')").css('margin-top',  ($("div:jqmData(role='header')").height()));
		if(window.localStorage["socio"] != undefined && window.localStorage["name"] != undefined) {
			$("#psocio").html(window.localStorage["socio"]);
			$("#pname").html(window.localStorage["name"]);
			$(".private").removeClass('private');
		}
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        alert('Received Event: ' + id);
		var pushNotification = window.plugins.pushNotification;
		pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"349344466742","ecb":"app.onNotificationGCM"});
		
    },
	errorHandler:function(error) {
		//alert(error);
	},
	successHandler: function(result) {
		//alert('Callback Success! Result = '+result)
	},
	onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
			{
				/* var uid = window.localStorage["userid"];
				$.post("http://www.clubmascodin.com/app/savegcm.php", {userid:uid,gcmkey:e.regid}, function(res) {
					if (res==true){

					}
				},"json"); */
			}
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
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
};

