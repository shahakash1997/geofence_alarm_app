import {registerRootComponent} from 'expo';

import App from './App';
import * as TaskManager from "expo-task-manager";
import {GEOFENCE_TASK_NAME, LOCATION_UPDATES} from "./src/constants/constant";
import {showToast} from "./src/components/Toaster";
import {vibrate} from "./src/utils/utils";
import {GeofencingEventType} from "expo-location";
import NotificationManager from "./src/utils/NotificationManager";
import {showBannerSound} from "./src/utils/NativeUtils";

registerRootComponent(App);
TaskManager.defineTask(LOCATION_UPDATES, ({data: {locations}, error}) => {
    if (error) {
        showToast(error.message)
        return;
    }
    //todo
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

        await NotificationManager.getInstance().showNotification(titleType);
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
