import {ScrollView, View} from "react-native";
import {Switch, Text} from "react-native-paper";
import {CommonStyles} from "../styles/CommonStyles";
import React, {useState} from "react";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";


const cache = AppLocalStorage.getInstance();
const SettingsScreen = () => {
    const [soundSwitch, setSoundSwitch] = useState(false);
    const [vibrateSwitch, setVibrateSwitch] = useState(false);

    return (
        <View style={CommonStyles.mainContainer}>
            <Text>App Settings</Text>
            <ScrollView>
                <Text>Sound</Text>
                <Switch value={soundSwitch} onValueChange={async () => {
                    setSoundSwitch(!soundSwitch);
                    await cache.setKeyInCache(CACHE_KEYS.SOUND_ENABLED, String(!soundSwitch));
                }}/>;
                <Text>Vibration</Text>
                <Switch value={vibrateSwitch} onValueChange={async () => {
                    setVibrateSwitch(!vibrateSwitch);
                    await cache.setKeyInCache(CACHE_KEYS.VIBRATION_ENABLED, String(!vibrateSwitch));

                }}/>;
            </ScrollView>
        </View>
    )

};

export default SettingsScreen;