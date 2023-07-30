import {NativeModules} from 'react-native';
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import * as FileSystem from "expo-file-system";
import {DownloadProgressData} from "expo-file-system";
import remoteConfig from '@react-native-firebase/remote-config';


const {AppUtilsModule} = NativeModules;

interface NativeAppUtilsInterface {
    getDistance(lat1: number, long1: number, lat2: number, long2: number): Promise<number>;

    showBannerAndPlaySound(sound: boolean, vibration: boolean): Promise<boolean>;

    openAndInstallApk(apkUri: string): Promise<boolean>


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


export async function downloadAPK(
    apkURL: string,
    version: string,
    callback: (progress: DownloadProgressData) => any
): Promise<string | undefined> {
    const fileUri = FileSystem.cacheDirectory + `${version}.apk`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const currentDate = new Date().toLocaleDateString();
    if (fileInfo.exists) {
        const fileDate = new Date(fileInfo.modificationTime ? fileInfo.modificationTime * 1000 : 0).toLocaleDateString();
        if (currentDate === fileDate)
            return fileInfo.uri;
    }
    const downloadResumable = FileSystem.createDownloadResumable(
        apkURL,
        FileSystem.cacheDirectory + `${version}.apk`,
        {},
        callback
    );
    const downloadResult = await downloadResumable.downloadAsync();
    return downloadResult?.uri;
}

/**
 * Opens & Install an APK file
 * @param uri - source of apk file
 */
export async function deleteApk(version: string) {
    await FileSystem.deleteAsync(FileSystem.cacheDirectory + `${version}.apk`);
}

export async function openAPKFile(uri: string) {
    return utils.openAndInstallApk(uri);
}

export async function getRemoteConfig(expiration: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            await remoteConfig().fetch(expiration);
            remoteConfig()
                .fetchAndActivate()
                .then((fetchedRemotely) => {
                    let config = remoteConfig().getAll();
                    if (fetchedRemotely) {
                        resolve(config);
                    } else {
                        resolve(config);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error: any) {
            reject(error);
        }
    });
}
