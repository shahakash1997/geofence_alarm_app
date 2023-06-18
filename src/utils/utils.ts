import {Audio} from 'expo-av';
import {Vibration} from "react-native";

const sound = new Audio.Sound();

export function isEmptyOrBlank(str: string | null | undefined) {
    return !str || str.length === 0 || /^\s*$/.test(str);
}


export async function playSound() {
    try {
        await sound.loadAsync(require('../../assets/sound.mp3'), {shouldPlay: true});
        await sound.setPositionAsync(0);
        await sound.playAsync();
        await sound.unloadAsync();

    } catch (error: any) {
        // An error occurred!
        console.log(error.message);
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