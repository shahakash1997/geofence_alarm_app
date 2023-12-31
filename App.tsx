import 'react-native-gesture-handler';
import React, {useEffect, useState} from "react";
import {showToast} from "./src/components/Toaster";
import {NavigationContainer} from '@react-navigation/native';
import LocationManager from "./src/utils/LocationManager";
import Main from "./src/screens/Main";
import auth from '@react-native-firebase/auth';

import {
    IBMPlexSans_100Thin,
    IBMPlexSans_100Thin_Italic,
    IBMPlexSans_200ExtraLight,
    IBMPlexSans_200ExtraLight_Italic,
    IBMPlexSans_300Light,
    IBMPlexSans_300Light_Italic,
    IBMPlexSans_400Regular,
    IBMPlexSans_400Regular_Italic,
    IBMPlexSans_500Medium,
    IBMPlexSans_500Medium_Italic,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_600SemiBold_Italic,
    IBMPlexSans_700Bold,
    IBMPlexSans_700Bold_Italic,
    useFonts
} from "@expo-google-fonts/ibm-plex-sans";
import ProgressDialog from "./src/widgets/ProgressDialog";
import {firebaseSignIn} from "./src/utils/firebase";


const locationManager = LocationManager.getInstance();
export default function App() {
    let [fontsLoaded] = useFonts({
        IBMPlexSans_400Regular,
        IBMPlexSans_600SemiBold,
        IBMPlexSans_300Light,
        IBMPlexSans_700Bold,
        IBMPlexSans_100Thin,
        IBMPlexSans_100Thin_Italic,
        IBMPlexSans_200ExtraLight,
        IBMPlexSans_200ExtraLight_Italic,
        IBMPlexSans_300Light_Italic,
        IBMPlexSans_400Regular_Italic,
        IBMPlexSans_500Medium,
        IBMPlexSans_500Medium_Italic,
        IBMPlexSans_600SemiBold_Italic,
        IBMPlexSans_700Bold_Italic,
    });
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>();

    // Handle user state changes
    function onAuthStateChanged(user: any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        firebaseSignIn().then().catch();
        return auth().onAuthStateChanged(onAuthStateChanged);
    }, []);

    useEffect(() => {
        (async () => {
            setUser({});
            const isLocationEnabled = locationManager.isLocationServicesEnabled();
            if (!isLocationEnabled) {
                showToast(
                    'Location Services not enabled! Please enable from settings!',
                );
            }
            await LocationManager.getInstance().checkForLocationPermissions();
        })();
    }, []);

    if (!fontsLoaded || initializing) {
        return <ProgressDialog visible={true} label={'Please wait...'}/>;
    } else {
        return (
            <NavigationContainer>
                <Main/>
            </NavigationContainer>
        );
    }
}

