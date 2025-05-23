import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/services/navigation/AppNavigator';
import {PermissionsAndroid, Platform} from "react-native";
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {RegisterContainer} from './src/containers/Register/RegisterContainer.tsx';


function App(): React.JSX.Element {

    async function showLocalNotification(remoteMessage) {
        const channel =
            remoteMessage.data?.channel ||
            remoteMessage.notification?.android?.channelId ||
            'default';

        const allowedChannels = ['crash', 'idle', 'lineout', 'overspeed'];
        const useChannel = allowedChannels.includes(channel) ? channel : 'default';

        const notificationId = `${useChannel}_${Date.now()}`;
        console.log(notificationId);

        await notifee.displayNotification({
            id: notificationId,
            title: remoteMessage.data?.title || remoteMessage.notification?.title,
            body: remoteMessage.data?.body || remoteMessage.notification?.body,
            android: {
                channelId: useChannel,
                sound: useChannel,
                importance: AndroidImportance.HIGH,
            },
        });
    }

    async function createCrashChannel() {
        await notifee.createChannel({
            id: 'crash',
            name: 'crash',
            sound: 'crash',
            importance: AndroidImportance.HIGH,
        });
    }

    async function createIdleChannel() {
        await notifee.createChannel({
            id: 'idle',
            name: 'idle',
            sound: 'idle', 
            importance: AndroidImportance.HIGH,
        });
    }

    async function createLineoutChannel() {
        await notifee.createChannel({
            id: 'lineout',
            name: 'lineout',
            sound: 'lineout',
            importance: AndroidImportance.HIGH,
        });
    }

    async function createOverspeedChannel() {
        await notifee.createChannel({
            id: 'overspeed',
            name: 'overspeed',
            sound: 'overspeed',
            importance: AndroidImportance.HIGH,
        });
    }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
