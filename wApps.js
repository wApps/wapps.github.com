console.log('wApp :-)')


wApps={

	uid:function(prefix){
		if(!prefix){prefix='UID'};
		var uid=prefix+Math.random().toString().slice(2);
		return uid
	},

	load:function(url,cb,er){ // load script / JSON, with optional callback and error functions
		if(!!url&&url.length>0){
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
		}else(cb());
		//return s.id
	},

	doBuildUI:function(id){
		console.log('buildUI');
		// Index Apps
		wApps.manifest.indexApps={};
		for(var i in wApps.manifest.apps){wApps.manifest.indexApps[wApps.manifest.apps[i].name]=i}; // index Apps
		wApps.manifest.indexAuthors={};
		for(var i in wApps.manifest.authors){wApps.manifest.indexAuthors[wApps.manifest.authors[i].name]=i}; // index Authors
		wApps.manifest.indexAppsAuthors={};
		for(var i in wApps.manifest.apps){ // index apps to authors
			if(!wApps.manifest.indexAppsAuthors[wApps.manifest.apps[i].author]){wApps.manifest.indexAppsAuthors[wApps.manifest.apps[i].author]=[]}
			wApps.manifest.indexAppsAuthors[wApps.manifest.apps[i].author].push(i);
		}; // index apps to Authors
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
		var container = $('<div class="container" id="wAppsContainer">').appendTo(buildTarget);
		var navHead = $('<div class="navbar navbar-inverse">').appendTo(container); // add navbar-inverse to the class to invert colors
		var innerHead = $('<div class="navbar-inner">').appendTo(navHead);
		var brand = $('<a class="brand" href="'+this.manifest.brand.url+'"><img id="wBrand" src="'+this.manifest.brand.pic+'" width="20"></a>').appendTo(innerHead);
		var navUl = $('<ul class="nav">').appendTo(innerHead);
		var bodyNames = Object.getOwnPropertyNames(this.manifest.tabs);
		for(var i in bodyNames){ // create header tabs
			this.manifest.tabs[bodyNames[i]].A = $('<a href="#" id="wAppsTabsA_'+bodyNames[i]+'">').appendTo($('<li id="wAppsTabsLi_'+bodyNames[i]+'">').appendTo(navUl)).html(bodyNames[i])[0];
		}
		// assemble body
		var wAppsBody = $('<div id="wAppsBody">').appendTo(container);
		for(var i in bodyNames){ // associate display of divs with header tags
			this.manifest.tabs[bodyNames[i]].Div = $('<div id="wAppsTabsDiv_'+bodyNames[i]+'">').appendTo(wAppsBody).html(this.manifest.tabs[bodyNames[i]].html)[0];
			if(i>0){$(this.manifest.tabs[bodyNames[i]].Div).hide()}
			this.manifest.tabs[bodyNames[i]].A.onclick=function(evt){
				var bodyNames = Object.getOwnPropertyNames(wApps.manifest.tabs);
				for(var i=0 in bodyNames){
					var d = $('#wAppsTabsDiv_'+bodyNames[i]);
					if(this.id=='wAppsTabsA_'+bodyNames[i]){$(d).show()}else{$(d).hide()}
				}
			}
		}
		// Assemble Footer
		var foot = $('<div id="wAppFoot"><hr><small><i>&nbsp;@ <a href="https://github.com/wApps/manifest#wapps-all-you-need-is-a-manifest" target=_blank>wApps</a>: <span id="wAppsFooter"></i></span></small></div>').appendTo(container);
		setInterval(function(){$('#wAppsFooter').html(Date())},1000);
		console.log(buildTarget)
		// build app Store
		wApps.buildStore();
		wApps.buildApps();
		wApps.loadMyApps();
		wApps.buildPeople();
		//$('#wAppsTabsA_Store').click(wApps.buildStore)
	},

	find:function(x,xx){ // find x in array xx
		var y = [];
		for(var i in xx){
			if(x==xx[i]){y.push(i)}
		}
		return y
	},

	loadMyApps:function(){ // add preload manifest.loadApps from localStore and URL call
		if(!!wApps.parms.loadApps){ // add any in the URL call
			wApps.manifest.loadApps = JSON.parse('["'+decodeURI(wApps.parms.loadApps).replace(/,/g,'","')+'"]');
		}
		if(!!localStorage.getItem('myWApps')){ // look in the localStorage
			var localApps=JSON.parse(localStorage.getItem('myWApps'));
			for(var i in localApps){ // add only those that are new
				if(this.find(localApps[i],wApps.manifest.loadApps).length==0){wApps.manifest.loadApps.push(localApps[i])}
			}
		}
		if(wApps.manifest.loadApps.length>0){ // if there are any to preload
			$('#wAppsTabsA_Store').click();// go to the store
			var appNames=[];
			for(var i in wApps.manifest.apps)[appNames.push(wApps.manifest.apps[i].name)]
			for(var i in wApps.manifest.loadApps){
				if(this.find(wApps.manifest.loadApps[i],appNames).length>0){ // if it matches
					var j = wApps.manifest.indexApps[wApps.manifest.loadApps[i]];
					$('#wAppCheckBox_'+j).click();
				}
			}
			$('#wAppsTabsA_myApps').click();
			var i = wApps.manifest.indexApps[wApps.manifest.loadApps[0]]; // find app at the top of the list
			$('#wAppTab_'+i+'_A').click(); // click on it
			localStorage.setItem('myWApps',JSON.stringify(wApps.manifest.loadApps)); // store new order
		}
	},

	buildUI:function(id,manifest){ // the manifest could actually come from somewhere else
		this.getParms(); // get parms provided with URL
		if(!manifest){
			if(!this.parms.manifest){manifest='manifest.js'} // the default is local manifest.js
				else{manifest=this.parms.manifest} // use manifest provided with URL
		}
		if(this.parms.addmanifest){manifest=[manifest,this.parms.addmanifest]} // if an addmanifest=... is specified
		this.load(manifest,function(){ // manifest could be an Array of urls, multiple manifests adding to eachother ...
			// add require method to each app in teh manifest
			for(var i in wApps.manifest.apps){ // add require to each App
    			wApps.manifest.apps[i].require=function(url,fun){
        			if(!window[this.namespace]){wApps.load(url,fun)}else{fun()}
				}
			};
			// sort apps alphabetically
			wApps.manifest.apps.sort(function(a,b){return a.name>b.name});
			// sort authors by last name
			for(var i in wApps.manifest.authors){ // first extract last name
				wApps.manifest.authors[i].lastName=wApps.manifest.authors[i].name.match(/[^\s]+$/)[0];
			}
			wApps.manifest.authors.sort(function(a,b){return a.lastName>b.lastName}); // then sort it
			// proceed to build UI
			wApps.doBuildUI(id);
		})
	},

	buildStore:function(){
		var div = wApps.manifest.tabs.Store.Div;
		div.innerHTML=''; // clear div
		// Add search input
		var searchApps = $('<input type="text" placeholder="search for wApps">').appendTo(div);
		//$('<hr>').appendTo(div);
		// list Apps
		var apps = wApps.manifest.apps;
		var appDiv=[];
		for(var i in apps){
			appDiv[i] = $('<div id="wApp_'+i+'">').appendTo(div);
			appDiv[i].html('<input type="checkbox" id="wAppCheckBox_'+i+'"> '+i+') <a href="'+wApps.manifest.apps[i].url+'" target=_blank>'+wApps.manifest.apps[i].name+'</a>,<small> by <i><a href="'+wApps.manifest.authors[wApps.manifest.indexAuthors[wApps.manifest.apps[i].author]].url+'" target=_blank>'+wApps.manifest.apps[i].author+'</a></i> [<a href="disqus.html?'+wApps.manifest.apps[i].name+'" target=_blank><image src="disqus-logo.png" width=40></a>]</small><p><i>'+wApps.manifest.apps[i].description+'</i></p>');
			if(wApps.manifest.myApps[i]){$('#wAppCheckBox_'+i)[0].checked=true};
			$('#wAppCheckBox_'+i).click(function(){wApps.getChecked(this)});
		}
	},

	buildApps:function(){ // build myApps container
		var div = wApps.manifest.tabs.myApps.Div;$(div).html('');
		var apps = wApps.manifest.apps;
		var appNavTabs = $('<div class="tabbable tabs-left">').appendTo(div);
		var appNavTabsUl = $('<ul class="nav nav-tabs" id="appNavTabsUl">').appendTo(appNavTabs);
		var appNavTabDiv = $('<div class="tab-content" id="appNavTabDiv">').appendTo(appNavTabs);
	},

	buildPeople:function(){
		var div = wApps.manifest.tabs.People.Div;
		var ul = $('<ul>').appendTo(div);
		for (var i in wApps.manifest.authors){
			var ai = $('<li id="wAppAuthor_'+i+'"><a href="'+wApps.manifest.authors[i].url+'" target=_blank>'+wApps.manifest.authors[i].name+'</a>: </li>').appendTo(div);
			for (var j in wApps.manifest.indexAppsAuthors[wApps.manifest.authors[i].name]){
				var ji = wApps.manifest.indexAppsAuthors[wApps.manifest.authors[i].name][j];
				$('<span><small> [ <a href="#" id="wAppPeopleApp_'+i+'_'+j+'">'+wApps.manifest.apps[ji].name+'</a> ] </small></span>').appendTo(ai);
				$('#wAppPeopleApp_'+i+'_'+j)[0].i=ji;
				$('#wAppPeopleApp_'+i+'_'+j).click(function(){
					$('#wAppsTabsA_Store').click();
					$('#wAppCheckBox_'+this.i).focus();
				});
			}
		}
	},

	getParms:function(){ // extract parameters concatenated with URL 
		var parms = document.location.search.slice(1).split('&').map(function(s){return s.split('=')});
		this.parms={}; // store them in wApps.parms
		for( var i in parms){if(parms[i][0].length>0){this.parms[parms[i][0]]=parms[i][1]}};
	},

	getChecked:function(that){
		var appNavTabsUl = ('#appNavTabsUl');
		var appNavTabDiv = ('#appNavTabDiv');
		var i0 = (that.id).match(/wAppCheckBox_(.+)/)[1];
		wApps.manifest.myAppsInd[i0]=$(that).is(':checked');
		wApps.manifest.myAppsNames=[]; // updated list of checked apps
		for(var i in wApps.manifest.myAppsInd){
			if(wApps.manifest.myAppsInd[i]){ // only true checks here
				wApps.manifest.myAppsNames.push(wApps.manifest.apps[i].name);
				if(!!wApps.manifest.myApps[i]){ // if the wApp is already there, hiding, show it
					$(wApps.manifest.myApps[i].tab).show();
				}
				else{ // otherwiese build it
					wApps.manifest.myApps[i]={
						tab:$('<li><a href="#wAppTab_'+i+'" data-toggle="tab" id="wAppTab_'+i+'_A">'+wApps.manifest.apps[i].name.replace(/\s/g,'<br>')+'</a></li>').appendTo(appNavTabsUl),
						div:$('<div class="tab-pane" id="wAppTab_'+i+'">').html('loading '+wApps.manifest.apps[i].name+'...').appendTo(appNavTabDiv)
					};
					wApps.manifest.apps[i].buildUI('wAppTab_'+i); // building happens here
				}
			}else{ // hide tabs of wApps just checked off (they'll have "false" values)
				$(wApps.manifest.myApps[i].tab).hide()
			};
		}
		//if($(that).is(':checked')){$(wApps.manifest.myApps[i0].tab).click()}; 
		localStorage.setItem('myWApps',JSON.stringify(wApps.manifest.myAppsNames)); // record name of myApps on local storage
		// $('#wAppCheckBox_2').click() <--- how to click and unclick programatically
	},

	manifest:{ // some of these will be filled in from the manifest
		brand:{pic:'',url:''},
		tabs:[],
		apps:[],
		authors:[],
		myApps:[], // where the list of selected apps will be recorded
		myAppsInd:[], // for convenience, also their indexes
		myAppsNames:[], // and names
		loadApps:[] // prepopulation of myApps
	}
}

// ini
//wApps.load('http://localhost:8888/wapps/manifest.json');
