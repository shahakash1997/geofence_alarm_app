import {downloadAPK, getRemoteConfig, openAPKFile} from "./NativeUtils";
import * as Application from 'expo-application';
import storage from '@react-native-firebase/storage';
import {DownloadProgressData} from "expo-file-system";

export interface AppUpdateResponse {
    version: string;
    appURL: string
}


export class AppAutoUpdateUtils {

    constructor() {
    }

    public async getUpdateDetails(): Promise<AppUpdateResponse | null> {
        try {
            console.log('Checking for update...')
            const config = await getRemoteConfig(0);
            if (config && config.latest_version && config.latest_version._value) {
                const currentAppVersion = await Application.nativeApplicationVersion;
                if (currentAppVersion) {
                    const currentVersion = parseFloat(currentAppVersion);
                    const configVersion = parseFloat(config.latest_version._value);
                    if (configVersion > currentVersion) {
                        return {
                            version: configVersion.toString(),
                            appURL: await storage().ref(`application/${configVersion}.apk`).getDownloadURL()
                        }
                    } else return null;
                } else return null;
            } else {
                console.log('Config Not available');
                return null;
            }
        } catch (error: any) {
            return null;
        }
    }

    public async downloadUpdate(appURL: string, version: string, callback: (progress: DownloadProgressData) => any) {
        const uri = await downloadAPK(appURL, version, callback);
        if (uri) {
            await openAPKFile(uri);
        }

    }
}