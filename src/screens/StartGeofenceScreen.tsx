import React, {useCallback, useEffect, useState} from "react";
import {SafeAreaView, View} from "react-native";
import {Button, Divider, Text, TextInput} from "react-native-paper";
import {showToast} from "../components/Toaster";
import {CommonStyles, Fonts} from "../styles/CommonStyles";
import LocationManager from "../utils/LocationManager";
import ProgressDialog from "../widgets/ProgressDialog";
import {SavedLocation} from "../models/models";
import {isEmptyOrBlank} from "../utils/utils";
import {LocationObject} from "expo-location";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import * as Location from 'expo-location';


const cache = AppLocalStorage.getInstance();

const locationManager = LocationManager.getInstance();
const StartGeofenceScreen = (props: any) => {
    const [radius, setRadius] = useState('');
    const [progress, setProgress] = useState(false);
    const geofenceData: SavedLocation = props.route.params;
    const [geofenceStarted, setGeofenceStarted] = useState(false);
    const [location, setLocation] = useState<LocationObject>();
    const [distance, setDistance] = useState<number>();


    const startLocationUpdates = useCallback(async () => {
        //Background for self calculation if geofencing fails
        if (!await locationManager.isUpdatesRunning())
            await locationManager.startLocationUpdates();
        //Foreground
        await locationManager.startForegroundLocationUpdates((location) => {
            console.log(location);
            setLocation(location);
            // calculate distance
            setDistance(1200000);
        })
    }, [location]);

    const stopLocationUpdateAndGeofencing = useCallback(async () => {
        if (await locationManager.hasGeofencingStarted())
            await locationManager.stopGeofencing();
        if (await locationManager.isUpdatesRunning())
            await locationManager.stopLocationUpdates();
        setGeofenceStarted(false);

    }, []);


    useEffect(() => {
        (async () => {
            const started = await locationManager.hasGeofencingStarted();
            setGeofenceStarted(started);
            if (started) {
                await startLocationUpdates();
            }
        })();
    }, []);
    if (geofenceStarted) {
        return (<SafeAreaView style={{flex: 1}}>
            <ProgressDialog visible={progress} label={'Please wait...'}/>
            <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
                <View style={{flex: 1}}>
                    <Text>{JSON.stringify(geofenceData)}</Text>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: Fonts.IBMPlexSans_600SemiBold
                        }}>{'Current Location'}</Text>
                        <Text
                            style={{
                                fontFamily: Fonts.IBMPlexSans_700Bold_Italic,
                                fontSize: 25, textAlign: 'center'
                            }}>{`${location?.coords.latitude},${location?.coords.longitude}`}</Text>
                        <Divider bold={true}/>
                        <Divider/>
                        <Divider/>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: Fonts.IBMPlexSans_600SemiBold
                        }}>{'Distance to cover'}</Text>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: Fonts.IBMPlexSans_700Bold_Italic
                        }}>{`${distance}m`}</Text>
                    </View>
                </View>
                <Button mode={'contained'}
                        uppercase={true}
                        onPress={async () => {
                            await stopLocationUpdateAndGeofencing();
                            await cache.setObjectInCache(CACHE_KEYS.LAST_GEOFENCE, {});
                        }}
                        style={[{borderRadius: 10}, CommonStyles.bottom]}>{'Stop Geofencing'}</Button>
            </View>
        </SafeAreaView>);
    } else return (
        <SafeAreaView style={{flex: 1}}>
            <ProgressDialog visible={progress} label={'Please wait...'}/>
            <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
                <View style={{flex: 1}}>
                    <Text>{JSON.stringify(geofenceData)}</Text>
                    <TextInput
                        style={{marginTop: 10}}
                        mode={'outlined'}
                        keyboardType={'numeric'}
                        label="Radius  (in m)"
                        value={radius}
                        onChangeText={text => setRadius(text)}
                    />
                </View>
                <Button mode={'contained'}
                        uppercase={true}
                        onPress={async () => {
                            if (await locationManager.hasGeofencingStarted()) {
                                showToast('Geofencing already running');
                            }
                            if (isEmptyOrBlank(radius)) {
                                showToast('Please enter radius');
                                return;
                            }
                            setProgress(true);
                            try {
                                let rd = parseInt(radius);
                                await locationManager.startGeofencing([{
                                    latitude: geofenceData.latitude,
                                    longitude: geofenceData.longitude,
                                    radius: rd,
                                    notifyOnEnter: true,
                                    notifyOnExit: true,
                                }]);
                                setGeofenceStarted(true);
                                await cache.setObjectInCache(CACHE_KEYS.LAST_GEOFENCE, geofenceData);
                                startLocationUpdates().then().catch();
                                setProgress(false);
                            } catch (error: any) {
                                showToast(error.message);
                                setProgress(false);
                            }
                        }}
                        style={[{borderRadius: 10}, CommonStyles.bottom]}>{'Start Geofencing'}</Button>
            </View>
        </SafeAreaView>);

};

export default StartGeofenceScreen;