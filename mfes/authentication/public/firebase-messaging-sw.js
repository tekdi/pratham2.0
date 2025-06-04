// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase configuration - same as in test.html
const firebaseConfig = {
      apiKey: env.NEXT_PUBLIC_FCM_API_KEY,
      authDomain: env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
      projectId: env.NEXT_PUBLIC_FCM_PROJECT_FCM_ID,
      storageBucket: env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
      messagingSenderId: env.NEXT_PUBLIC_FCM_MESSAGING_SENDER,
      appId: env.NEXT_PUBLIC_FCM_FCM_APP_ID,
      measurementId: env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
    };

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    
    // Customize notification here
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new message',
        icon: payload.notification?.image || '/firebase-logo.png',
        badge: '/firebase-logo.png',
        tag: 'notification-tag',
        renotify: true,
        requireInteraction: true,
        data: {
            click_action: payload.data?.link || '/',
            ...payload.data
        },
        actions: [
            {
                action: 'open',
                title: 'Open App'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.');
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    // Open the app when notification is clicked
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                const url = event.notification.data?.click_action || '/';
                
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes(url) && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Open new window if app is not open
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// Handle push event (additional handling for reliability)
self.addEventListener('push', (event) => {
    console.log('[firebase-messaging-sw.js] Push event received:', event);
    
    if (event.data) {
        try {
            const payload = event.data.json();
            console.log('[firebase-messaging-sw.js] Push payload:', payload);
            
            // Ensure notification is shown even if Firebase doesn't handle it
            if (payload.notification) {
                const notificationTitle = payload.notification.title || 'New Notification';
                const notificationOptions = {
                    body: payload.notification.body || 'You have a new message',
                    icon: payload.notification.image || '/firebase-logo.png',
                    badge: '/firebase-logo.png',
                    tag: 'backup-notification',
                    renotify: true,
                    requireInteraction: true,
                    data: payload.data || {}
                };
                
                event.waitUntil(
                    self.registration.showNotification(notificationTitle, notificationOptions)
                );
            }
        } catch (error) {
            console.error('[firebase-messaging-sw.js] Error parsing push data:', error);
        }
    }
}); 