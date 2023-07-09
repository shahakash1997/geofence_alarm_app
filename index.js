import {registerRootComponent} from 'expo';

import App from './App';
import * as TaskManager from "expo-task-manager";
import {GEOFENCE_TASK_NAME, LOCATION_UPDATES} from "./src/constants/constant";
import {showToast} from "./src/components/Toaster";
import {checkNewDistance, vibrate} from "./src/utils/utils";
import {GeofencingEventType} from "expo-location";
import NotificationManager from "./src/utils/NotificationManager";
import {showBannerSound} from "./src/utils/NativeUtils";
import AppLocalStorage, {CACHE_KEYS} from "./src/cache/AppLocalStorage";
import {AppRegistry} from "react-native";
import LocationManager from "./src/utils/LocationManager";

registerRootComponent(App);
TaskManager.defineTask(LOCATION_UPDATES, ({data: {locations}, error}) => {
    if (error) {
        showToast(error.message)
        return;
    }
    checkNewDistance(locations).then().catch();
    console.log('Received new locations', locations);
});

TaskManager.defineTask(
    GEOFENCE_TASK_NAME,
    async ({data: {eventType, region}, error, executionInfo}) => {
        let titleType = '';
        if (eventType === GeofencingEventType.Enter)
            titleType = "Entering";
        else
            titleType = "Exiting"

        const gLocation = await AppLocalStorage.getInstance().getObjectFromCache(CACHE_KEYS.LAST_GEOFENCE);
        await NotificationManager.getInstance().showNotification('Geofence Updates', `You are ${titleType} the ${gLocation.name} region.`);
        await vibrate();
        if (error) {
            // check `error.message` for more details.
            console.log(error);
            return;
        }
        if (eventType === GeofencingEventType.Enter) {
            await showBannerSound();
            console.log("You've entered region:", region);
        } else if (eventType === GeofencingEventType.Exit) {
            console.log("You've left region:", region);
        }
    },
);

AppRegistry.registerHeadlessTask('STOP_GEOFENCING', () => {
    console.log('Called Background Headless service!')
    showToast('Stopping Services...')
    Promise.all([LocationManager.getInstance().stopLocationUpdates,
        LocationManager.getInstance().stopGeofencing]).then(() => {
        console.log('Geofencing and Location Updates stopped By Headless service!');
        showToast('Geofencing stopped. Thanks');
    }).catch(error => {
        console.log(error);
    });
});