﻿
var zero_cache = 'my-site-cache-v1';
var urlsToCache = [
  '/hjtest/index.html',
  '/hjtest/css/main.css'
];

self.addEventListener('install', function(event) {
	self.skipWaiting(); //대기상태를 건너뛰고 서비스 워커를 바로 실행
	// Perform install steps
	event.waitUntil(
	caches.open(zero_cache)
	  .then(function(cache) {
		console.log('Opened cache');
		return cache.addAll(urlsToCache);
	  })
	);
});

self.addEventListener('activate', function(event) {
	console.log('Service Worker Activated', event);
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
//console.log( response );
        }

		var fetchRequest = event.request.clone(); // response 복제
		return fetch(fetchRequest).then(
			function(response){
				if(!response || response.status != 200 || response.type !== 'basic'){
					return response;
				}

				var responseToCache = response.clone();
				cashes.open('my-site-cache-v1')
					.then(function(cache) {
						cache.put(event.request, responseToCach);
				});

				return response;
        //return fetch(event.request);
      }
    )
  })
  );
});



/*
self.addEventListener('push', function(event) {
  //푸시 리스너
	var payload = event.data.json();
	const title = payload.title;
	const options = {
		body: payload.body,
		icon: '/hjtest/images/fav.ico',
		badge: '/hjtest/images/badge.png',
		vibrate: [200, 100, 200, 100, 200, 100, 400],
		data : payload.params
	};
	event.waitUntil( self.registration.showNotification(title, options) );
});

self.addEventListener('notificationclick', function(event) {
  //푸시 노티피케이션 에서 클릭 리스너
	var data = event.notification.data;
	event.notification.close();
	event.waitUntil( clients.openWindow( data.url ) );
});

*/



function showNotification() {
  Notification.requestPermission(function(result) {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Vibration Sample', {
          body: 'test! test!',
          icon: '/hjtest/images/badge.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'vibration-sample'
        });
      });
    }
  });
}



function testPush(message) {
	navigator.serviceWorker.ready.then(function(registration) {
	  registration.active.postMessage({
		type: 'test-push',
		message: message
	  });
	});
}



self.addEventListener('push', function(e) {
	var options = {
		body: '푸시 테스트 입니당!',
		icon: '/hjtest/images/badge.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: '2'
		},
		actions: [
			{ action: 'explore', title: 'Explore this new world',
			icon: '/hjtest/images/badge.png'},
			{ action: 'close', title: 'Close',
			icon: '/hjtest/images/badge.png'}
		]
	};
	e.waitUntil(
		self.registration.showNotification('푸시 테스트!', options)	
	);

});

self.addEventListener('notificationclick', function(event) {
  //푸시 노티피케이션 에서 클릭 리스너
	var data = event.notification.data;
	event.notification.close();
	event.waitUntil( clients.openWindow( data.url ) );
});
