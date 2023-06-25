import * as Notifications from 'expo-notifications';
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import {SavedLocation} from "../models/models";


const cache = AppLocalStorage.getInstance();

export default class NotificationManager {
    private static instance: NotificationManager;

    constructor() {
    }

    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }

    public async showNotification(type: string) {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
        const gLocation: SavedLocation = await cache.getObjectFromCache(CACHE_KEYS.LAST_GEOFENCE);
        const notificationResult = await Notifications.scheduleNotificationAsync({
            content: {
                title: `Geofencing Updates`,
                body: `You are ${type} the ${gLocation.name} region.`,
            },
            trigger: null,
        });
        console.log(notificationResult);
    }


}


