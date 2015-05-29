// login wApp
console.log('wApp Google login :-)');

loginGoogle={
	//getAssessToken:function(){
	//	this.access_token=document.location.href.match(/access_token=([^&]+)/)[1];
	//	$('<i class="icon-plus-sign"></i>').appendTo($("#login"));
	//}
	ini:function(){ // have the body start with login.ini()
		var ak = document.location.href.match(/access_token=([^&]+)/);
		if(!!ak){
			this.access_token=ak[1];
			$('<a id="showLogin" href=#><i class="icon-plus-sign"></i></a><a id="hideLogin" href=#><i class="icon-minus-sign"></i></a><p id="userInfo"></p>').appendTo($("#login"));
			$('#showLogin').click(function(){loginGoogle.showLogin()});
			$('#hideLogin').click(function(){loginGoogle.hideLogin()});
			$.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+this.access_token,function(x){
				loginGoogle.userInfo=x;
				loginGoogle.userInfoUI();
				$('#showLogin').click();

			})
		}
	},

	userInfoUI:function(){
		$('#userInfo').html(JSON.stringify(this.userInfo));

	},

	showLogin:function(){
		//console.log('show login');
		$('#showLogin').hide();
		$('#hideLogin').show();
		$('#userInfo').show();

	},

	hideLogin:function(){
		//console.log('hide login');
		$('#hideLogin').hide();
		$('#showLogin').show();
		$('#userInfo').hide();

	},

	receiveMessage:function(event){
		var parm = event.data, res;
		console.log('FT heard: '+parm);
		// handle the message, it should specify what part of the login object is wanted
		if(!loginGoogle[parm]){
			res=NaN;
		}
		else{
			if(typeof(loginGoogle[parm])=='function'){res=(loginGoogle[parm]).toString()}
			else{res=loginGoogle[parm]};
		}
		console.log('FT responded: ',res);
		loginGoogle.sendMessage(res);
	},

	sendMessage:function(msg,target){
		if(!target){target=window.parent}; // assume this is an iframe
		target.postMessage(msg,"*");
	}

}

// listening if talked to
window.addEventListener("message", loginGoogle.receiveMessage, false);
//window.parent.postMessage("ole","*"); // talking back

// ini
//login.ini();

