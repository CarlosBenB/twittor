//Imports
importScripts('js/sw-utils.js');






const STATIC_CACHE      = 'static-v2';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';

const appSell = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
    ];

const appShell_inmut = [    
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    //'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener ('install', event => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll (appSell) );
    
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll (appShell_inmut) );

    event.waitUntil (Promise.all ( [cacheStatic, cacheInmutable] ));
});

self.addEventListener ('activate', event => {
        
    //Eliminar las versiones anterior de cache que ya no sirven
    const borrarCache = caches.keys().then(keys => {
        //Para aplicar a cada registro del cache
        keys.forEach( key => {
            //static-v4
            if( key !== STATIC_CACHE && key.includes('static') ){
                return caches.delete(key);
            }

        });
    });
    
    
    event.waitUntil(borrarCache);

});

//Prueba con cache only

self.addEventListener('fetch', event =>{

    const respuesta = caches.match (event.request).then(res => {
        if(res) {
            return res;
        }else {
            
            return fetch(event.request).then(newRes => {
                
                return actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newRes);

            });

        }    
        
    });
    event.respondWith(respuesta);
});