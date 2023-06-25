import * as Location from 'expo-location';
import {Accuracy, LocationAccuracy, LocationCallback, LocationRegion} from 'expo-location';
import {GEOFENCE_TASK_NAME, LOCATION_UPDATES} from '../constants/constant';

export default class LocationManager {
    private static instance: LocationManager;

    constructor() {
    }

    public static getInstance(): LocationManager {
        if (!LocationManager.instance) {
            LocationManager.instance = new LocationManager();
        }
        return LocationManager.instance;
    }

    public async checkForLocationPermissions(): Promise<boolean> {
        await Location.enableNetworkProviderAsync();
        if (await this.checkForegroundLocation()) {
            return this.checkBackgroundLocation();
        } else {
            return false;
        }
    }

    private async checkBackgroundLocation(): Promise<boolean> {
        let permissionResponse = await Location.getBackgroundPermissionsAsync();
        if (permissionResponse.status === 'granted') {
            return true;
        } else {
            let {status} = await Location.requestBackgroundPermissionsAsync();
            return status === 'granted';
        }
    }

    private async checkForegroundLocation(): Promise<boolean> {
        let permissionResponse = await Location.getForegroundPermissionsAsync();
        if (permissionResponse.status === 'granted') {
            return true;
        } else {
            let {status} = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        }
    }



    public async getCurrentPositionAsync() {
        return Location.getCurrentPositionAsync({
            accuracy: Accuracy.Highest,
        });
    }

    public async isLocationServicesEnabled() {
        return Location.hasServicesEnabledAsync();
    }

    public async stopGeofencing() {
        await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
    }

    public async startLocationUpdates() {
        await Location.startLocationUpdatesAsync(LOCATION_UPDATES, {
            showsBackgroundLocationIndicator: true,
            mayShowUserSettingsDialog: true,
            accuracy: LocationAccuracy.Highest,
            timeInterval: 10000,
            distanceInterval: 100,
            foregroundService: {
                notificationTitle: 'Office Commute Geofence app is running',
                notificationBody: 'Have a good sleep. I will awake you. Trust me!',
                killServiceOnDestroy: false
            }
        });
    }

    public async stopLocationUpdates() {
        await Location.stopLocationUpdatesAsync(LOCATION_UPDATES);
    }

    public async startForegroundLocationUpdates(callback: LocationCallback) {
        await Location.watchPositionAsync({
            accuracy: LocationAccuracy.Low,
            mayShowUserSettingsDialog: true,
            timeInterval: 10000,
            distanceInterval: 100
        }, callback);

    }

    public async hasGeofencingStarted() {
        return await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
    }

    public async isUpdatesRunning() {
        return await Location.hasStartedLocationUpdatesAsync(LOCATION_UPDATES);
    }

    public async startGeofencing(locationRegions: LocationRegion[]) {
        await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, locationRegions);
    }
}
