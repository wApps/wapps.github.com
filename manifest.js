
wApps.manifest.apps.push(
    {
    "name": "Login@ S3DB.UAB",
    "description": "<p>Very simple login into UAB's S3DB cloud deployment using jmat's toolbox.</p><p>The login credentials will be stored at wApps.s3db.info.</p>",
    "url": "https://code.google.com/p/jmat/", // home page of App
    "namespace":'jmat',
    buildUI:function(id){
        this.require('http://localhost:8888/jmat/jmat.js',
            function(){
                $('<div id="'+id+'_s3dbLogin">').appendTo($('#'+id));// create login div
                var url = 'https://uab.s3db.org/s3db'
                jmat.s3db.UI.login(
                    url,
                    function(){
                        wApps.s3db=jmat.s3db.info;
                        console.log('s3db login successful :-)');
                        $('<div>Logged in at '+url+': <p>'+JSON.stringify(wApps.s3db.uid)+'</p>').appendTo($('#'+id));
                    },
                    id+'_s3dbLogin'
                )
                //console.log(id);
            });
        }
    },

    {
    "name": "QMachine",
    "description": "QMachine volunteer",
    "url": "http://v1.qmachine.org",
    "namespace":'QM',
    buildUI:function(id){
        this.require('', // script needed to volunteer compute cycles to QM
            function(){
                $('#'+id).html("<h1>QMachine</h1>Volunteering to Sean's QMachine will go here, Sean, can you please change the manifest accordingly?");
            });
        }
    }
);

wApps.manifest.authors.push(
    {
    }
);

wApps.manifest.brand={
    pic:'brand.png',
    url:'http://en.wikipedia.org/wiki/s3db'
};

wApps.manifest.checkedApps=[];

wApps.manifest.bodies={
    "myApps":{
        html:'Apps you selected from the AppStore ...',
        Div:{} // where the DOM element will be set later 
    },
    "Store":{
        html:'Retrieving list of Apps from the manifest ...',
        Div:{}
    },
    "People":{
        html:'Retrieving list of people authoring Apps ...',
        Div:{}
    },
    "About":{
        html:'<h1>wApps</h1>This is an experiment in loosening the architecture of a webApp store to achieve a deeper integration between autonomously developed components.',
        Div:{}
    }
};


for(var i in wApps.manifest.apps){wApps.manifest.apps[i].require=wApps.load}



/*
    {
        "name": "RPPA",
        "description": "Real time analysis of reverse phase protein data.",
        "url": "https://raw.github.com/agrueneberg/TCGA.rppa/master/rppa.js"
    },
    {
        "name": "Import",
        "description": "Import your files and compare them to the reference data in TCGA.",
        "url": "https://raw.github.com/agrueneberg/TCGA.import/master/import.js"
    },
    {
        "name": "Dropbox",
        "description": "Access your Dropbox and load files into the TCGA Toolbox.",
        "url": "https://raw.github.com/agrueneberg/TCGA.dropbox/master/dropbox.js"
    },
    {
        "name": "Databases",
        "description": "Activate third-party databases for use with the TCGA Toolbox.",
        "url": "https://raw.github.com/agrueneberg/TCGA.databases/master/databases.js"
    }
)
*/