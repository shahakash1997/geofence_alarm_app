import * as Notifications from 'expo-notifications';
import AppLocalStorage from "../cache/AppLocalStorage";


const cache = AppLocalStorage.getInstance();

export default class NotificationManager {
    private static instance: NotificationManager;
    private notificationId: string | undefined;

    constructor() {
    }

    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }

    public async showNotification(title: string, message: string) {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
        if (this.notificationId) {
            await Notifications.scheduleNotificationAsync({
                    identifier: this.notificationId,
                    content: {
                        title: title,
                        body: message,
                    },
                    trigger: null,
                }
            )

        } else {
            this.notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: message,
                },
                trigger: null,
            });
        }
    }


}


