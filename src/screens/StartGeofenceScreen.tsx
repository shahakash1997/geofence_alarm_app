import React, {useEffect, useState} from "react";
import {SafeAreaView, View} from "react-native";
import {Button, Text, TextInput} from "react-native-paper";
import {showToast} from "../components/Toaster";
import {CommonStyles} from "../styles/CommonStyles";
import LocationManager from "../utils/LocationManager";
import ProgressDialog from "../widgets/ProgressDialog";
import {SavedLocation} from "../models/models";
import {isEmptyOrBlank} from "../utils/utils";
import {LocationObject} from "expo-location";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";

const cache = AppLocalStorage.getInstance();

const locationManager = LocationManager.getInstance();
const StartGeofenceScreen = (props: any) => {
    const [radius, setRadius] = useState('');
    const [progress, setProgress] = useState(false);
    const geofenceData: SavedLocation = props.route.params;
    const [geofenceStarted, setGeofenceStarted] = useState(false);
    const [location, setLocation] = useState<LocationObject>();

    useEffect(() => {
        (async () => {
            const started = await locationManager.hasGeofencingStarted();
            setGeofenceStarted(started);
        })();
    }, []);
    if (geofenceStarted) {
        return (<SafeAreaView style={{flex: 1}}>
            <ProgressDialog visible={progress} label={'Please wait...'}/>
            <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
                <View style={{flex: 1}}>
                    <Text>{JSON.stringify(geofenceData)}</Text>
                    <Text>{'Current Location'}</Text>
                    <Text>{`${location?.coords.latitude},${location?.coords.longitude}`}</Text>
                </View>
                <Button mode={'contained'}
                        onPress={async () => {
                            if (await locationManager.hasGeofencingStarted())
                                await locationManager.stopGeofencing();
                            if (await locationManager.isUpdatesRunning())
                                await locationManager.stopLocationUpdates();
                            setGeofenceStarted(false);
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
                        onPress={async () => {
                            if (await locationManager.hasGeofencingStarted()) {
                                showToast('GEOFENCE already running');
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
                                await cache.setObjectInCache(CACHE_KEYS.LAST_GEOFENCE, geofenceData);
                                await locationManager.startLocationUpdates();
                                await locationManager.startForegroundLocationUpdates((location) => {
                                    console.log('FG updates ')
                                    console.log(location);
                                    setLocation(location);
                                })
                                setProgress(false);
                                setGeofenceStarted(true);
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