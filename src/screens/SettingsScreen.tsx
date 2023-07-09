import {ScrollView, View} from "react-native";
import {Switch, Text} from "react-native-paper";
import {CommonStyles} from "../styles/CommonStyles";
import React, {useEffect, useState} from "react";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";


const cache = AppLocalStorage.getInstance();
const SettingsScreen = () => {
    const [soundSwitch, setSoundSwitch] = useState(false);
    const [vibrateSwitch, setVibrateSwitch] = useState(false);

    useEffect(() => {
        (async () => {
            const ss = await cache.getKeyFromCache(CACHE_KEYS.SOUND_ENABLED);
            const vv = await cache.getKeyFromCache(CACHE_KEYS.VIBRATION_ENABLED);
            setVibrateSwitch(vv ? vv === 'true' : true);
            setSoundSwitch(ss ? ss === 'true' : true)

        })();
    }, []);

    return (
        <ScrollView style={CommonStyles.mainContainer}>
            <View>
                <View style={{padding: 10}}>
                    <Text>{'Sound'}</Text>
                    <Switch value={soundSwitch} onValueChange={async () => {
                        setSoundSwitch(!soundSwitch);
                        await cache.setKeyInCache(CACHE_KEYS.SOUND_ENABLED, String(!soundSwitch));
                    }}/>
                </View>
                <View style={{padding: 10}}>
                    <Text>{'Vibration'}</Text>
                    <Switch value={vibrateSwitch} onValueChange={async () => {
                        setVibrateSwitch(!vibrateSwitch);
                        await cache.setKeyInCache(CACHE_KEYS.VIBRATION_ENABLED, String(!vibrateSwitch));

                    }}/>
                </View>
            </View>
        </ScrollView>
    )
};

export default SettingsScreen;