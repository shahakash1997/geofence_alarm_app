import Storage from './Storage';

export const CACHE_KEYS = {
    USER_INFO: 'USER_INFO',
    LAST_PUNCH_IN: 'LAST_PUNCH_IN',
    USER_LOCATIONS : 'USER_LOCATIONS'
};
export default class AppLocalStorage {
    private storage: Storage = Storage.getInstance();
    private static instance: AppLocalStorage;

    public static getInstance() {
        if (!AppLocalStorage.instance) {
            AppLocalStorage.instance = new AppLocalStorage();
        }
        return AppLocalStorage.instance;
    }
    public async setObjectInCache(keyName: string, obj: any) {
        await this.storage.setObject(keyName, obj);
    }
    public async getObjectFromCache(keyName: string): Promise<any> {
        return await this.storage.getObject(keyName);
    }
    public async setKeyInCache(keyName: string, keyValue: string) {
        await this.storage.setItem(keyName, keyValue);
    }
    public async getKeyFromCache(keyName: string): Promise<string | null> {
        try {
            let keyValue = await this.storage.getItem(keyName);
            if (keyValue != null) {
                return keyValue;
            } else {
                return null;
            }
        } catch (error: any) {
            return null;
        }
    }
    public async clearKeys(keys: string[]) {
        try {
            for (let i = 0; i < keys.length; i++) {
                await this.storage.deleteItem(keys[i]);
            }
        } catch (error: any) {}
    }
}
