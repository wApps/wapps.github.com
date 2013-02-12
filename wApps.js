console.log('wApp :-)')


wApps={

	uid:function(prefix){
		if(!prefix){prefix='UID'};
		var uid=prefix+Math.random().toString().slice(2);
		return uid
	},

	load:function(url,cb,er){ // load script / JSON, with optional callback and error functions
		if(typeof(url)=='string'){url=[url]}; // url can be a string or an array of strings
		var s = document.createElement('script');
		s.src=url[0];
		s.id = wApps.uid();
		if(!cb){cb=function(){console.log(url[0]+' loaded')}};
		if(!er){er=function(evt){console.log('ERROR loading '+url[0]+':',evt)}};
		if(url.length>1){
			s.onload = function(){wApps.load(url.slice(1),cb,er)}
		}else{s.onload=cb} // callback is only applied to the last loading
		s.onerror=er;  // error function is applied to all loadings
		document.body.appendChild(s);
		setTimeout('document.body.removeChild(document.getElementById("'+s.id+'"));',3000); // is the waiting still needed ?
		//return s.id
	},

	doBuildUI:function(id){
		console.log('buildUI');
		// Find UI build target
		var buildTarget; // DOM element where to build UI 
		if(!id){buildTarget=$(document.body)} // if no target is provided then use the document.body
			else{
				if($('#'+id).length==0){ // if build target is not found, create it first
					$('<div id="'+id+'">').appendTo(document.body);
				};
				buildTarget=$('#'+id);
		}
		// Assemble Head
		var container = $('<div class="container">').appendTo(buildTarget);
		var navHead = $('<div class="navbar navbar-inverse">').appendTo(container);
		var innerHead = $('<div class="navbar-inner">').appendTo(navHead);
		var brand = $('<a class="brand" href="'+this.manifest.brand.url+'"><img id="wBrand" src="'+this.manifest.brand.pic+'" width=20></a>').appendTo(innerHead);
		var navUl = $('<ul class="nav">').appendTo(innerHead);
		var bodyNames = Object.getOwnPropertyNames(this.manifest.bodies);
		for(var i in bodyNames){ // create header tabs
			this.manifest.bodies[bodyNames[i]].A = $('<a href="#" id="wAppsBodiesA_'+bodyNames[i]+'">').appendTo($('<li id="wAppsBodiesLi_'+bodyNames[i]+'">').appendTo(navUl)).html(bodyNames[i])[0];
		}
		// assemble body
		var wAppsBody = $('<div id="wAppsBody">').appendTo(container);
		for(var i in bodyNames){ // associate display of divs with header tags
			this.manifest.bodies[bodyNames[i]].Div = $('<div id="wAppsBodiesDiv_'+bodyNames[i]+'">').appendTo(wAppsBody).html(this.manifest.bodies[bodyNames[i]].html)[0];
			if(i>0){$(this.manifest.bodies[bodyNames[i]].Div).hide()}
			this.manifest.bodies[bodyNames[i]].A.onclick=function(evt){
				var bodyNames = Object.getOwnPropertyNames(wApps.manifest.bodies);
				for(var i=0 in bodyNames){
					var d = $('#wAppsBodiesDiv_'+bodyNames[i]);
					if(this.id=='wAppsBodiesA_'+bodyNames[i]){$(d).show()}else{$(d).hide()}
				}
			}
		}
		// Assemble Footer
		var foot = $('<div if="wAppFoot"><hr><small><i>&nbsp;@ w.Apps: <span id="wAppsFooter"></i></span></small></div>').appendTo(container);
		setInterval(function(){$('#wAppsFooter').html(Date())},1000);
		console.log(buildTarget)
	},
	buildUI:function(id,manifest){
		if(!manifest){manifest='manifest.js'}
		this.load(manifest,function(){
			wApps.doBuildUI(id);
		})
	},

	manifest:{ // these will be filled in from teh manifest
		apps:[],
		authors:[],
		bodies:{},
		brand:{pic:'',url:''}
	}, 

	buildStore:function(){
		//this.load('manifest.json',function(){
			console.log(9)
		//})
	}
}

// ini
//wApps.load('http://localhost:8888/wapps/manifest.json');
