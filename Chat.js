
// Text Chat Code here ============================================================================================
            var UniqueValue = (Math.random() * 1000).toString().replace('.', '');
            var urlFirebase = "https://webrtc-signaling.firebaseio.com/";
			
			var firebase2 = new Firebase(urlFirebase);
			
			var TicketNumber="";
			
		function GetCall(TicketNumber)
			{
			alert("Get Call")
			  var Result=urlFirebase.concat(TicketNumber);
			
			  firebase2 = new Firebase(Result);
			  
			 var btnSendFirebaseMessageChat= document.getElementById('btnSendFirebaseMessageChat');
			
	
			 
			var chatDiv=document.getElementById('txtChatDiv');
			
				firebase2.on('child_added', function(snap) {
				var data = snap.val();
				if (data.textMessage) {
				    console.log("????????" + data.textMessage);
				chatDiv.innerHTML = chatDiv.innerHTML + data.textFrom + ': ' + data.textMessage+'<br>';
							
				}
			})

		}
		
			
			
			
		btnSendFirebaseMessageChat.onclick = function () {
		
			  sendMessage();
			};
			
			
			//=============Handle Enter key
			$("#textBoxChat").keypress(function (e) {
				if(e.which == 13) {
					sendMessage();
					$('#textBoxChat').click();
				}
			});

			
			
			
			 function sendMessage()
			 {
			
			   firebase2.push({
			       textMessage: textBoxChat.value,
					textFrom: '<b><u><font color="blue">'+ sessionStorage.userName+'</font></u><b> :'
			   });
			   textBoxChat.value = "";
			 
			 }
			 
			 
//====================================================================================================================	


//====================Bootstrap Modal Code here
	$(document).ready(function(){
	
         
			if(sessionStorage.userName=='' || sessionStorage.userName=='undefined' || sessionStorage.userName==null)
			{
			
				$('#exampleModal').modal('show');
			
			}
			
		      DisableChating();			  
			
			
    });
		
		
		$('.btnProfile').click(function(){
		
		    $('#exampleModal').modal('show');

		});
		function CallmodalConfiguration(Tickets)
		{
		    $('#txtTicket').val(Tickets);
		    $('#exampleModal').modal('show');
		}

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
				else if($('#txtTicket').val()=='' || $('#txtTicket').val()=='undefined')
				{
				  alert('Sorry your,Ticket is Required. ')
				  return

				}
			    TicketNumber=$('#txtTicket').val();
				sessionStorage.userName=$('#recipient-name').val(); 
				//console.log("Ticket Number: " + TicketNumber)
				//console.log("User Name: " + sessionStorage.userName)
				 $('#lblTicket').text('');
				 $('#lblTicket').append('<hr>Your current Ticket number is: <font color="Red">'+TicketNumber+'</font><hr>');
				if( TicketNumber && sessionStorage.userName)
				{
				   // console.log("Ticket Number : " + TicketNumber)
				  //  console.log("Session UserName : " + sessionStorage.userName)
				    EnableChating();
				    GetCall(TicketNumber);
				}
				else
				{
					DisableChating();		
				  $('.btnProfile').hide();
		
				}
				 
				  $('#exampleModal').modal('hide');

		}

		function EnableChating()
		{
			 $('.btnProfile').hide();
			 document.getElementById("btnSendFirebaseMessageChat").disabled = false;
			 document.getElementById("textBoxChat").disabled = false;
		}

		function DisableChating()
		{
		    document.getElementById("btnSendFirebaseMessageChat").disabled = true;
			 document.getElementById("textBoxChat").disabled = true;
		}

//handle bootstrap Enter Key

		$("#recipient-name").keypress(function(e) {
		
						if(e.which == 13) {
							handleUserName();
							
						
						}
						
			});

	$('#btnTicket').click(function(){
	   
	    $('#lblTicket').text('');
		 var Ticket = (Math.random() * 1000).toString().replace('.', '');
		 
		 $('#lblTicket').append('<hr>Add this Ticket your <u><a href="javascript:void(0)" class="btnProfile" onclick=" CallmodalConfiguration(' + Ticket + ')" title="click here to configure your chat"> Configuration:</a> </u><font color="Red">' + Ticket + '</font><hr>');
		 
		// GetCall(Ticket);
	 
	});
//===================================================================
