var UniqueValue = (Math.random() * 1000).toString().replace('.', '');
var urlFirebase = "https://webrtc-signaling.firebaseio.com/";
var res="";

			var config = {
			
			openSocket: function(config) {
			
			var channel = config.channel || location.href.replace( /\/|:|#|%|\.|\[|\]/g , '');
			
			var socket = new Firebase('https://webrtc.firebaseIO.com/' + channel);
			
			socket.channel = channel;
			
			socket.on("child_added", function(data) {
			
			config.onmessage && config.onmessage(data.val());
			
			});
			socket.send = function(data) {
			
			this.push(data);
			
			};
			config.onopen && setTimeout(config.onopen, 1);
			
			socket.onDisconnect().remove();
			
			return socket;
			},
			onRemoteStream: function(media) {
			
			var mediaElement = getMediaElement(media.video, {
			
			width: (videosContainer.clientWidth / 2) - 50,
			buttons: ['mute-audio', 'mute-video', 'full-screen', 'volume-slider']
			
			});
			mediaElement.id = media.streamid;
			videosContainer.insertBefore(mediaElement, videosContainer.firstChild);
			},
			onRemoteStreamEnded: function(stream, video) {
			if (video.parentNode && video.parentNode.parentNode && video.parentNode.parentNode.parentNode) {
			video.parentNode.parentNode.parentNode.removeChild(video.parentNode.parentNode);
			}
			},
			onRoomFound: function(room) {
		
			var alreadyExist = document.querySelector('button[data-broadcaster="' + room.broadcaster + '"]');
			if (alreadyExist) return;
			if (typeof roomsList === 'undefined') roomsList = document.body;
			var tr = document.createElement('tr');
			tr.innerHTML = '<td><strong>' + room.roomName + '</strong> shared a conferencing room with you!</td>' +
			'<td><button class="join">Join</button></td>';
			roomsList.insertBefore(tr, roomsList.firstChild);
			var joinRoomButton = tr.querySelector('.join');
			joinRoomButton.setAttribute('data-broadcaster', room.broadcaster);
			joinRoomButton.setAttribute('data-roomToken', room.roomToken);
			joinRoomButton.onclick = function() {
			
			this.disabled = true;
			//=========Check for User Name
			//alert("Joined Room "+ room.roomToken);
			sessionStorage.globalRoomName=room.roomName;
			res = urlFirebase.concat(sessionStorage.globalRoomName);
			//firebase2 = new Firebase(res);
			console.log("Room Joined"+res);
			 GetCall(res);
			if(sessionStorage.userName=='' || sessionStorage.userName=='undefined' || sessionStorage.userName==null)
			{
			
				$('#exampleModal').modal('show');
				DisableChating();
			}
			else
			{
			  EnableChating();
			}
			//==============================
			var broadcaster = this.getAttribute('data-broadcaster');
			var roomToken = this.getAttribute('data-roomToken');
			captureUserMedia(function() {
			conferenceUI.joinRoom({
			roomToken: roomToken,
			joinUser: broadcaster
			});
			}, function() {
			
			joinRoomButton.disabled = false;
			});
			};
			},
			onRoomClosed: function(room) {
			//alert("Room Closed");
			DisableChating();
			sessionStorage.globalRoomName=UniqueValue;
			res = urlFirebase.concat(sessionStorage.globalRoomName);
			//firebase2 = new Firebase(res);
			console.log("Room Closed"+res);
			 GetCall(res);
			var joinButton = document.querySelector('button[data-roomToken="' + room.roomToken + '"]');
			if (joinButton) {
			// joinButton.parentNode === <li>
			// joinButton.parentNode.parentNode === <td>
			// joinButton.parentNode.parentNode.parentNode === <tr>
			// joinButton.parentNode.parentNode.parentNode.parentNode === <table>
			joinButton.parentNode.parentNode.parentNode.parentNode.removeChild(joinButton.parentNode.parentNode.parentNode);
			}
			}
			};
			function setupNewRoomButtonClickHandler() {
			var txtRoom=document.getElementById('conference-name').value;
			
			//Check Room name Validation
			if(txtRoom==null|| txtRoom=='undefined' ||txtRoom=='')
			{
			 alert("Room Name Required");
			 return
			}
			
			btnSetupNewRoom.disabled = true;
			document.getElementById('conference-name').disabled = true;
			captureUserMedia(function() {
			sessionStorage.globalRoomName=txtRoom;
			
			res = urlFirebase.concat(sessionStorage.globalRoomName);
			// firebase2 = new Firebase(res);
			 GetCall(res);
			console.log("Create Conference Room"+ res);
			conferenceUI.createRoom({
			  roomName: (document.getElementById('conference-name') || { }).value || 'Anonymous',
			
			});
			}, function() {
			btnSetupNewRoom.disabled = document.getElementById('conference-name').disabled = false;
			//alert("Room Created 1");
			});
			}
			function captureUserMedia(callback, failure_callback) {
			var video = document.createElement('video');
			getUserMedia({
			video: video,
			onsuccess: function(stream) {
			config.attachStream = stream;
			callback && callback();
			video.setAttribute('muted', true);
			var mediaElement = getMediaElement(video, {
			width: (videosContainer.clientWidth / 2) - 50,
			buttons: ['mute-audio', 'mute-video', 'full-screen', 'volume-slider']
			});
			mediaElement.toggle('mute-audio');
			videosContainer.insertBefore(mediaElement, videosContainer.firstChild);
			},
			onerror: function() {
			alert('unable to get access to your webcam');
			callback && callback();
			}
			});
			}
			var conferenceUI = conference(config);
			/* UI specific */
			var videosContainer = document.getElementById('videos-container') || document.body;
			var btnSetupNewRoom = document.getElementById('setup-new-room');
			var roomsList = document.getElementById('rooms-list');
			if (btnSetupNewRoom) btnSetupNewRoom.onclick = setupNewRoomButtonClickHandler;
			function rotateVideo(video) {
			video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
			setTimeout(function() {
			video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
			}, 1000);
			}
			(function() {
			var uniqueToken = document.getElementById('unique-token');
			if (uniqueToken)
			if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
			else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace( /\./g , '-');
			})();
			function scaleVideos() {
			var videos = document.querySelectorAll('video'),
			length = videos.length, video;
			var minus = 130;
			var windowHeight = 700;
			var windowWidth = 600;
			var windowAspectRatio = windowWidth / windowHeight;
			var videoAspectRatio = 4 / 3;
			var blockAspectRatio;
			var tempVideoWidth = 0;
			var maxVideoWidth = 0;
			for (var i = length; i > 0; i--) {
			blockAspectRatio = i * videoAspectRatio / Math.ceil(length / i);
			if (blockAspectRatio <= windowAspectRatio) {
			tempVideoWidth = videoAspectRatio * windowHeight / Math.ceil(length / i);
			} else {
			tempVideoWidth = windowWidth / i;
			}
			if (tempVideoWidth > maxVideoWidth)
			maxVideoWidth = tempVideoWidth;
			}
			for (var i = 0; i < length; i++) {
			video = videos[i];
			if (video)
			video.width = maxVideoWidth - minus;
			}
			}
			window.onresize = scaleVideos;
		











		
			
			
			
			
// Text Chat Code here ============================================================================================
			function GetCall(url)
			{
			
			 firebase2 = new Firebase(url);
			 
			 var btnSendFirebaseMessage= document.getElementById('btnSendFirebaseMessage');
			
		   // console.log("Final Firebase"+res);
			 
			
			//firebase2=res.concat(sessionStorage.globalRoomName); 
			var chatDiv=document.getElementById('ChatDiv');
			
				firebase2.on('child_added', function(snap) {
				var data = snap.val();
				if(data.textMessage) {
				chatDiv.innerHTML = chatDiv.innerHTML + data.textFrom + ': ' + data.textMessage+'<br>';
							
				}
			})

			}
		
			
			
			
			btnSendFirebaseMessage.onclick = function() {
		
			  sendMessage();
			};
			
			//=============Handle Enter key
			$("#textBox").keypress(function(e) {
				if(e.which == 13) {
					sendMessage();
				$('#textBox').click();
				}
			});

			
			 function sendMessage()
			 {
			
			   firebase2.push({
					textMessage: textBox.value,
					textFrom: '<b><u><font color="blue">'+ sessionStorage.userName+'</font></u><b> :'
			   });
			  textBox.value="";
			 
			 }
//====================================================================================================================		


//====================Bootstrap Modal Code here
	$(document).ready(function(){
	
        sessionStorage.globalRoomName=UniqueValue;
		
		 res = urlFirebase.concat(sessionStorage.globalRoomName); 
			//var firebase2 = new Firebase(res);
			//console.log("Firebase Configured"+res);
		
//=========================End Firebase configuration=======================
	
            GetCall(res);
			
			if(sessionStorage.userName=='' || sessionStorage.userName=='undefined' || sessionStorage.userName==null)
			{
			
				$('#exampleModal').modal('show');
				//DisableChating();
			}
			//if(sessionStorage.globalRoomName=='' || sessionStorage.globalRoomName==null || sessionStorage.globalRoomName=='undefined' || sessionsSorage.globalRoomName==UniqueValue)
			// {
				
				DisableChating();
				  
			//}
			
    });
		
		
		$('#btnProfile').click(function(){
		
		    $('#exampleModal').modal('show');

		});
		

		$('#btnName').click(function(){

		  handleUserName();

		});
		
		
		function handleUserName()
		{

				if($('#recipient-name').val()=='' || $('#recipient-name').val()=='undefined')
				{
				  alert('Enter your name')
				  return
				}
			
				if(sessionStorage.globalRoomName && sessionStorage.globalRoomName !=  UniqueValue)
				{
			     	//alert("Chating Enabled "+ sessionStorage.globalRoomName+" = "+ UniqueValue)
				    EnableChating();
				  
				}
				else
				{
					DisableChating();		
				  $('#btnProfile').hide();
		
				}
				  sessionStorage.userName=$('#recipient-name').val(); 
				  $('#exampleModal').modal('hide');

		}

		function EnableChating()
		{
			$('#btnProfile').hide();
			 document.getElementById("btnSendFirebaseMessage").disabled = false;
			 document.getElementById("textBox").disabled = false;
		}

		function DisableChating()
		{
			 document.getElementById("btnSendFirebaseMessage").disabled = true;
			 document.getElementById("textBox").disabled = true;
		}

//handle bootstrap Enter Key

		$("#recipient-name").keypress(function(e) {
		
						if(e.which == 13) {
							handleUserName();
							
						
						}
						
			});


//===================================================================
			