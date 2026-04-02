import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import StatusNotification from './StatusNotification';

function UserNotifications({ user }) {
  const [notification, setNotification] = useState(null);
  const isFirstLoad = useRef(true);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, 'reports'), where('userEmail', '==', user.email));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        
        if (data.status === 'Verified' || data.status === 'Resolved') {
          // Create a unique key for this specific report and status
          const notifKey = `notified_${doc.id}_${data.status}`;
          
          // Check if this user has already seen this specific notification before
          if (!localStorage.getItem(notifKey)) {
            // Found an unseen notification!
            setNotification({
              id: doc.id,
              type: data.status,
              location: data.location,
              issueType: data.issueType,
              key: notifKey // Pass key to mark as seen later
            });
            
            // Try to play sound
            try {
              audioRef.current.volume = 0.5;
              audioRef.current.play().catch(() => {});
            } catch (e) {}
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <StatusNotification 
      notification={notification} 
      onClose={() => {
        if (notification?.key) {
          localStorage.setItem(notification.key, 'true');
        }
        setNotification(null);
      }} 
    />
  );
}

export default UserNotifications;
