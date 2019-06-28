self.importScripts('js/lokijs.js');
self.importScripts('js/loki-indexed-adapter.js');

db = new loki("veris.db", { 
    adapter: new LokiIndexedAdapter("veris.db"),
    autoload: true,
  });

console.log("SW Startup!");

// Install Service Worker
self.addEventListener('install', function(event){
    console.log('installed!');
});

// Service Worker Active
self.addEventListener('activate', function(event){
    console.log('activated!');
});


self.addEventListener('message', function(event){
    setInterval(()=>{   
        collection = db.getCollection("logs")       
        let lastestRecord = collection.chain().simplesort("created", true).data()[0]["created"]
        fetch("https://p2tj73cdah.execute-api.us-east-1.amazonaws.com/development?created="+lastestRecord)
        .then(response=>{
            return response.json()
        })  
        .then((data)=>{  return data.Items.map(item=>{
            return {
                department: item.department.S,
                designation: item.designation.S,
                created: item.created.S,
                group: item.group.S,
                email: item.email.S,
                phone: item.phone.S,
                name: item.name.S,
                gender: item.gender.S,
                type: item.type.S,
                id: item.id.N,
                }
            }) 
        })
        .then(data=>{
            if(data.length>0){
                collection.insert(data)
                db.saveDatabase()
                event.ports[0].postMessage("New Data Available");
            }
        })            
    },5000)
});