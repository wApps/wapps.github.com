
wApps.manifest.apps.push(
    {
    "name": "Simple S3DB login",
    "description": "Very simple login into S3DB using jmat's toolbox",
    "url": "https://raw.github.com/agrueneberg/TCGA.rppa/master/homepage",
    "namespace":'jmat',
    buildUI:function(id){
        this.require('http://jmat.github.com/jmat.js',
            function(){
                jmat.s3db.login(id)
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
        this.require('https://v1.qmachine.org/q.js',
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