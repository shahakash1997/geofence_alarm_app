import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_KEY_PREFIX = 'SEBI_';
class Storage {
    private static classInstance?: Storage;
    static prefixKey: string;
    private constructor() {}

    public static getInstance(): Storage {
        if (!this.classInstance) {
            this.classInstance = new Storage();
            Storage.prefixKey = LOCAL_STORAGE_KEY_PREFIX;
        }
        return this.classInstance;
    }
    /**
     * Get a single item
     *
     * @param {string} key
     * @returns {Promise<string | null>}
     */
    async getItem(key: string): Promise<string | null> {
        if (!key) {
            throw new TypeError('In-valid params.');
        }
        return await AsyncStorage.getItem(Storage.prefixKey + key);
    }
    async setItem(key: string, value: string): Promise<void> {
        if (!(key && value)) {
            throw TypeError('In-valid params.');
        }
        return await AsyncStorage.setItem(Storage.prefixKey + key, value);
    }

    /**
     * Save a Object
     *
     * @param {string} key
     * @returns {Promise<{}|[]>}
     */
    async setObject(key: string, value: {} | [] | null): Promise<void> {
        if (!key) {
            throw TypeError('In-valid params.');
        } else {
            return await AsyncStorage.setItem(
                Storage.prefixKey + key,
                JSON.stringify(value),
            );
        }
    }

    /**
     * Get an Object
     *
     * @param {string} key
     * @returns {Promise<void>}
     */
    // the return type of the function could be made as Generic
    async getObject(key: string): Promise<{} | [] | null> {
        if (!key) {
            throw new TypeError('In-valid params.');
        }
        let val: string | null = await AsyncStorage.getItem(
            Storage.prefixKey + key,
        );
        if (val !== null) {
            const obj = JSON.parse(val);
            return obj;
        } else {
            return null;
        }
    }
    /**
     * Deletes a single item
     * @param {string} key
     * @returns {Promise<void>}
     */
    // need to handle cases for wrongs keys
    async deleteItem(key: string): Promise<void> {
        if (!key) {
            throw new TypeError('In-valid params.');
        }
        await AsyncStorage.removeItem(Storage.prefixKey + key);
    }

    async deleteMultiple(keys: string[]) {
        if (!keys || keys.length === 0) {
            throw new TypeError('In-valid params.');
        }
        const alteredKeys = keys.map(k => {
            if (k.startsWith(Storage.prefixKey)) {
                return k;
            } else {
                return Storage.prefixKey + k;
            }
        });
        await AsyncStorage.multiRemove(alteredKeys);
    }
    async getAllKeys(prefix: string): Promise<string[]> {
        if (!prefix) {
            throw new TypeError('In-valid params.');
        }
        const keys = await AsyncStorage.getAllKeys();
        return keys.filter(key => {
            return key.startsWith(Storage.prefixKey + prefix);
        });
    }
}

// const storage = new Storage();
export default Storage;
