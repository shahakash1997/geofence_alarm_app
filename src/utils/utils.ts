import {Vibration} from "react-native";
import {LocationGeocodedAddress} from "expo-location/src/Location.types";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import {SavedLocation} from "../models/models";
import {getDistance, showBannerSound} from "./NativeUtils";
import {LocationObject} from "expo-location";
import NotificationManager from "./NotificationManager";


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
        await NotificationManager.getInstance().showNotification('Distance Update', `${distance}m to destination!`);
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

export function getStringAddress(geocodedAddresses: LocationGeocodedAddress[]): string {
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

}