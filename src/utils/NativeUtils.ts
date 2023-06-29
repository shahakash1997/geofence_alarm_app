import {NativeModules} from 'react-native';

const {AppUtilsModule} = NativeModules;

interface NativeAppUtilsInterface {
    getDistance(lat1: number, long1: number, lat2: number, long2: number): Promise<number>;

    showBannerAndPlaySound(): Promise<boolean>;


}

const utils = AppUtilsModule as NativeAppUtilsInterface;
export async function showBannerSound() {
    await utils.showBannerAndPlaySound();
}

export async function getDistance(lat1: number, long1: number, lat2: number, long2: number) {
    return await utils.getDistance(lat1, long1, lat2, long2);
}