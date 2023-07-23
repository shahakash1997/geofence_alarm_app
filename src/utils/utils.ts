import {Vibration} from "react-native";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import {SavedLocation} from "../models/models";
import {getDistance, showBannerSound} from "./NativeUtils";
import {LocationObject} from "expo-location";
import NotificationManager from "./NotificationManager";
import LocationManager from "./LocationManager";
import LocationDB from "../database/LocationDB";


export function isEmptyOrBlank(str: string | null | undefined) {
    return !str || str.length === 0 || /^\s*$/.test(str);
}

export async function checkNewDistance(locations: LocationObject[]) {
    if (!locations || locations.length === 0) return;
    const geofenceData: SavedLocation = await AppLocalStorage.getInstance().getObjectFromCache(CACHE_KEYS.LAST_GEOFENCE);
    if (!geofenceData) return;
    const distance = await getDistance(geofenceData.latitude, geofenceData.longitude, locations[0].coords.latitude, locations[0].coords.longitude);
    const accuracyCache = await AppLocalStorage.getInstance().getKeyFromCache(CACHE_KEYS.GEOFENCE_ACCURACY);
    const accuracy: number = accuracyCache ? parseInt(accuracyCache) : 500;

    if (distance <= accuracy) {
        await NotificationManager.getInstance().showNotification('Geofence Updates', `You are ${'Entering'} the ${geofenceData.name} region.`);
        await vibrate();
        await showBannerSound();
    } else {
        console.log('Not reached yet')
        await NotificationManager.getInstance().showNotification('Distance Update', `${(distance / 1000).toFixed(2)}KM(s) to destination!`);
    }

}


export async function vibrate() {
    const ONE_SECOND_IN_MS = 1000;
    const PATTERN = [
        1 * ONE_SECOND_IN_MS,
        2 * ONE_SECOND_IN_MS,
        3 * ONE_SECOND_IN_MS,
    ];
    Vibration.vibrate(PATTERN);
}

export async function getStringAddress(geofenceData: SavedLocation): Promise<string> {
    if (geofenceData.latitude >= -90 && geofenceData.latitude <= 90 && geofenceData.longitude >= -180 && geofenceData.longitude <= 180) {
        try {
            const geocodedAddresses = await LocationManager.getInstance().getAddress(geofenceData.latitude, geofenceData.longitude)
            if (geocodedAddresses.length === 0) return '';
            else if (geocodedAddresses.length > 0) {
                const actualAddress = geocodedAddresses[0];
                let address = '';
                address += actualAddress.name + ', ';
                address += actualAddress.subregion + ' ';
                address += actualAddress.district + ` (${actualAddress.postalCode}) `;
                address += actualAddress.city + ' ';
                address += actualAddress.country + `(${actualAddress.isoCountryCode}) `;
                return address;
            } else return '';
        } catch (error: any) {
            console.log(error.message)
            return error.message;
        }
    } else {
        return "Invalid Latitude or longitude!";
    }
}

export async function checkIfLocationAlreadyAdded(current: SavedLocation, db: LocationDB) {
    try {
        const savedLocations = await db.getAllLocations();
        for (const loc of savedLocations) {
            const dis = await getDistance(loc.latitude, loc.longitude, current.latitude, current.longitude);
            if (dis <= 10) {
                return true;
            }
        }
        return false;
    } catch (err: any) {
        return false;
    }

}

export function checkCoords(latitude: number, longitude: number) {
    return (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180)
}