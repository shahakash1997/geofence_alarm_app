import {NativeModules} from 'react-native';
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";

const {AppUtilsModule} = NativeModules;

interface NativeAppUtilsInterface {
    getDistance(lat1: number, long1: number, lat2: number, long2: number): Promise<number>;

    showBannerAndPlaySound(sound: boolean, vibration: boolean): Promise<boolean>;


}

const utils = AppUtilsModule as NativeAppUtilsInterface;

export async function showBannerSound() {
    const cache = AppLocalStorage.getInstance();
    const snd = await cache.getKeyFromCache(CACHE_KEYS.SOUND_ENABLED);
    const vib = await cache.getKeyFromCache(CACHE_KEYS.VIBRATION_ENABLED);
    let enableSound;
    let enableVibration;
    enableSound = snd ? snd === 'true' : true;
    enableVibration = vib ? vib === 'true' : true;
    await utils.showBannerAndPlaySound(enableSound, enableVibration);
}

export async function getDistance(lat1: number, long1: number, lat2: number, long2: number) {
    return await utils.getDistance(lat1, long1, lat2, long2);
}