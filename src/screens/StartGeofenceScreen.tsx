import React, {useCallback, useEffect, useRef, useState} from "react";
import {DeviceEventEmitter, SafeAreaView, ScrollView, View} from "react-native";
import {Button, Card, Text, TextInput} from "react-native-paper";
import {showToast} from "../components/Toaster";
import {CommonStyles, Fonts} from "../styles/CommonStyles";
import LocationManager from "../utils/LocationManager";
import ProgressDialog from "../widgets/ProgressDialog";
import {SavedLocation} from "../models/models";
import {getStringAddress, isEmptyOrBlank} from "../utils/utils";
import {LocationObject} from "expo-location";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import LottieView from 'lottie-react-native';
import {getDistance} from "../utils/NativeUtils";
import {useGlobalSessionState} from "../cache/AppState";
import LocationDB from "../database/LocationDB";
import {useNavigation} from "@react-navigation/native";
import AddLocationDialog from "../components/AddLocationDialog";


const cache = AppLocalStorage.getInstance();

const locationManager = LocationManager.getInstance();
const StartGeofenceScreen = (props: any) => {
    const animation = useRef(null);
    const [radius, setRadius] = useState('');
    const [progress, setProgress] = useState(false);
    const [geofenceData, setGeofenceData] = useState<SavedLocation>(props.route.params);
    const [geofenceStarted, setGeofenceStarted] = useState(false);
    const [location, setLocation] = useState<LocationObject>();
    const [distance, setDistance] = useState<string>('');
    const sessionState = useGlobalSessionState();
    const navigator = useNavigation();
    const [editDialog, setEditDialog] = useState(false);
    const [locationName, setLocationName] = useState('');


    useEffect(() => {
        DeviceEventEmitter.addListener('APP_UPDATES', async () => {
            const started = await locationManager.hasGeofencingStarted();
            setGeofenceStarted(started);
            if (!started)
                sessionState.setAppSession(started, null);
        });
        (async () => {
                const started = await locationManager.hasGeofencingStarted();
                setGeofenceStarted(started);
                if (started) {
                    const rad = await cache.getKeyFromCache(CACHE_KEYS.GEOFENCE_ACCURACY);
                    setRadius(rad ?? '');
                    await startLocationUpdates();
                } else {
                    sessionState.setAppSession(false, null);
                }
                setLocationName(await getStringAddress(geofenceData));
            }
        )();
    }, []);

    const startLocationUpdates = useCallback(async () => {
        //Background for self calculation if geofencing fails
        if (!await locationManager.isUpdatesRunning())
            await locationManager.startLocationUpdates();
        //Foreground
        await locationManager.startForegroundLocationUpdates((location) => {
            setLocation((prevState) => {
                getDistance(location.coords.latitude,
                    location.coords.longitude,
                    geofenceData.latitude,
                    geofenceData.longitude).then((dist) => {
                    setDistance((dist / 1000).toFixed(2));
                });
                return location;
            });
        })
    }, [location]);

    const stopLocationUpdateAndGeofencing = useCallback(async () => {
        if (await locationManager.hasGeofencingStarted())
            await locationManager.stopGeofencing();
        if (await locationManager.isUpdatesRunning())
            await locationManager.stopLocationUpdates();
        setGeofenceStarted(false);
        await cache.setObjectInCache(CACHE_KEYS.LAST_GEOFENCE, null);
        sessionState.setAppSession(false, null);

    }, []);
    if (geofenceStarted) {
        return (<SafeAreaView style={CommonStyles.mainContainer}>
            <ProgressDialog visible={progress} label={'Please wait...'}/>
            <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
                <View style={{flex: 1}}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: Fonts.IBMPlexSans_600SemiBold
                        }}>{'Current Location 📍'}</Text>
                        <Text
                            style={{
                                fontFamily: Fonts.IBMPlexSans_700Bold_Italic,
                                fontSize: 25, textAlign: 'center'
                            }}>{`${location?.coords.latitude.toFixed(2)},${location?.coords.longitude.toFixed(2)}`}</Text>
                        <Text
                            style={{
                                fontFamily: Fonts.IBMPlexSans_700Bold_Italic,
                                fontSize: 25, textAlign: 'center'
                            }}>{`${radius}m 🧭`}</Text>

                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{
                                width: '100%',
                                height: 300,
                                backgroundColor: 'white',
                            }}
                            source={require('../../assets/bus.json')}
                        />
                        <Text style={{
                            fontSize: 20,
                            fontFamily: Fonts.IBMPlexSans_600SemiBold
                        }}>{'Aerial Distance to cover'}</Text>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: Fonts.IBMPlexSans_700Bold_Italic
                        }}>{`${distance} Km`}</Text>
                    </View>
                </View>
                <Button mode={'contained'}
                        uppercase={true}
                        onPress={async () => {
                            await stopLocationUpdateAndGeofencing();
                        }}
                        style={[{borderRadius: 10}, CommonStyles.bottom]}>{'Stop Geofencing'}</Button>
            </View>
        </SafeAreaView>);
    } else return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <ProgressDialog visible={progress} label={'Please wait...'}/>
                <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
                    <View style={{flex: 1}}>
                        <Card>
                            <Card.Content>
                                <Text variant="titleLarge">{geofenceData.name.toLocaleUpperCase()}</Text>
                                <Text variant="bodyMedium">{locationName}</Text>
                                <LottieView
                                    autoPlay
                                    ref={animation}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'auto',
                                    }}
                                    source={require('../../assets/Location_Forked.json')}
                                />
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={() => {
                                    setEditDialog(true);
                                }}>Edit Location</Button>
                                <Button onPress={async () => {
                                    const db = await LocationDB.getInstance();
                                    const deleted = await db.deleteLocation(geofenceData);
                                    const locations = await db.getAllLocations();
                                    sessionState.setSavedLocations(locations);
                                    if (deleted)
                                        navigator.goBack();
                                    else {
                                        showToast("Unable to delete")
                                    }

                                }}>Delete</Button>
                            </Card.Actions>
                        </Card>
                    </View>
                </View>

            </ScrollView>
            <View style={[CommonStyles.bottom, {padding: 10}]}>
                <TextInput
                    style={{marginTop: 10}}
                    mode={'outlined'}
                    keyboardType={'numeric'}
                    label="Radius  (in m)"
                    value={radius}
                    onChangeText={text => setRadius(text)}
                />
                <Button mode={'contained'}
                        uppercase={true}
                        onPress={async () => {
                            if (await locationManager.hasGeofencingStarted()) {
                                showToast('Geofencing already running');
                                return;
                            }
                            if (isEmptyOrBlank(radius)) {
                                showToast('Please enter radius');
                                return;
                            }
                            let rd = parseInt(radius);
                            if (isNaN(rd) || rd === 0 || rd < 0) {
                                showToast('Invalid radius');
                                return;
                            }
                            setProgress(true);
                            try {
                                await locationManager.startGeofencing([{
                                    latitude: geofenceData.latitude,
                                    longitude: geofenceData.longitude,
                                    radius: rd,
                                    notifyOnEnter: true,
                                    notifyOnExit: true,
                                }]);
                                setGeofenceStarted(true);
                                await cache.setObjectInCache(CACHE_KEYS.LAST_GEOFENCE, geofenceData);
                                await cache.setKeyInCache(CACHE_KEYS.GEOFENCE_ACCURACY, rd.toString());
                                startLocationUpdates().then().catch();
                                sessionState.setAppSession(true, geofenceData);
                                setProgress(false);
                            } catch (error: any) {
                                showToast('Error is '+error.message);
                                setProgress(false);
                            }
                        }}
                        style={[{borderRadius: 10, marginTop: 10}]}>{'Start Geofencing'}</Button>
            </View>
            <AddLocationDialog
                locationName={geofenceData.name}
                latitude={geofenceData.latitude}
                longitude={geofenceData.longitude}
                locationId={geofenceData.id}
                visible={editDialog} hideDialog={async () => {
                setEditDialog(false);
                const db = await LocationDB.getInstance();
                const newLoc: SavedLocation = await db.getById(geofenceData.id);
                if (newLoc) {
                    setGeofenceData(newLoc);
                }
            }}/>
        </SafeAreaView>
    );

};

export default StartGeofenceScreen;