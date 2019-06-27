self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('react-loki-table').then(function(cache) {
        return cache.addAll([
          '/index.html',
        ]);
      })
    );
   })

self.addEventListener('activate', function(event) {
    setInterval(()=>{
       fetch("https://p2tj73cdah.execute-api.us-east-1.amazonaws.com/development?created=")
      .then(response=>{
          return response.json()
      })  
      .then(data=>console.log("Hit"))  
      },5000) 
   });