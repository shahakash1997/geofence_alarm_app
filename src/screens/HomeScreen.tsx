import React, {useEffect, useState} from "react";
import {DeviceEventEmitter, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import {FlashList} from "@shopify/flash-list";
import {AnimatedFAB, Appbar, Chip, Text} from "react-native-paper";
import AddLocationDialog from "../components/AddLocationDialog";
import LocationDB from "../database/LocationDB";
import LocationItem from "../components/LocationItem";
import {AppStylesSecondary} from "../styles/CommonStyles";
import {Routes} from "../constants/Routes";
import LocationManager from "../utils/LocationManager";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import SnackbarCustom from "../widgets/SnackbarCustom";
import {useGlobalSessionState} from "../cache/AppState";
import {AppAutoUpdateUtils, AppUpdateResponse} from "../utils/AppAutoUpdateUtils";
import AppUpdate from "../components/AppUpdate";


const appUpdateUtils = new AppAutoUpdateUtils();

const handleEmpty = () => {
    return (
        <Text style={[AppStylesSecondary.titleText, {fontSize: 20, padding: 20}]}>{' No locations present!'}</Text>);
};
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';


const locationManager = LocationManager.getInstance();
const cache = AppLocalStorage.getInstance();
const HomeScreen = ({navigation}: any) => {
    const [visible, setVisible] = useState(true);
    const [isExtended, setExtended] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [snackVisible, setSnackVisible] = useState<boolean>(false);
    const sessionState = useGlobalSessionState();
    const [menu, showMenu] = useState(false);
    const [listRefreshing, setListRefreshing] = useState(false);
    const [appUpdateLink, setAppUpdateLink] = useState<AppUpdateResponse>();
    const [updateDialog, setUpdateDialog] = useState(false);

    // Use Effect for app updates
    useEffect(() => {
        (async () => {
            const updateDetails = await appUpdateUtils.getUpdateDetails();
            console.log(updateDetails);
            const lastUpdated = await cache.getKeyFromCache(CACHE_KEYS.LAST_UPDATED);
            if (!lastUpdated) return;
            if (updateDetails) {
                setAppUpdateLink(updateDetails);
                setUpdateDialog(true);
            }
        })();
    }, []);


    //when app is opened for first time
    useEffect(() => {
        DeviceEventEmitter.addListener('APP_UPDATES', async () => {
            const started = await locationManager.hasGeofencingStarted();
            if (!started)
                sessionState.setAppSession(started, null);
        });
        (async () => {
            const lastLocation = await cache.getObjectFromCache(CACHE_KEYS.LAST_GEOFENCE);
            if (lastLocation && await LocationManager.getInstance().hasGeofencingStarted()) {
                sessionState.setAppSession(true, lastLocation);
            } else {
                sessionState.setAppSession(false, null);
            }
            await updateList();
        })();
    }, []);
    const updateList = async () => {
        const db = await LocationDB.getInstance();
        const locations = await db.getAllLocations();
        sessionState.setSavedLocations(locations);
    };

    useEffect(() => {
        (async () => {
            await updateList();
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Saved Locations"/>
                <Appbar.Action icon="tools" onPress={() => {
                    navigation.navigate(Routes.SETTINGS_SCREEN);
                }}/>
            </Appbar.Header>
            <View style={{flex: 1}}>
                {sessionState.isGeofenceRunning() && sessionState.getGeofenceData() &&
                    <Chip icon="information" onPress={() => console.log('Pressed')}>
                        {`Geofence Service running for ${sessionState.getGeofenceData()?.name}`}
                    </Chip>
                }
                <FlashList
                    onRefresh={async () => {
                        setListRefreshing(true);
                        await updateList()
                        setListRefreshing(false);
                    }}
                    refreshing={listRefreshing}
                    ListEmptyComponent={handleEmpty}
                    data={sessionState.getSavedLocations()}
                    renderItem={({item}) => <LocationItem data={item} onClick={async (item) => {
                        const lg = await cache.getObjectFromCache(CACHE_KEYS.LAST_GEOFENCE);
                        if (await locationManager.hasGeofencingStarted() && lg) {
                            if (lg.id === item.id) {
                                navigation.navigate(Routes.GEOFENCE_SCREEN, {...item});
                            }
                            setSnackVisible(true);
                        } else navigation.navigate(Routes.GEOFENCE_SCREEN, {...item});
                    }}/>}
                    estimatedItemSize={200}
                />
            </View>
            <AnimatedFAB
                icon={'plus'}
                label={'Label'}
                extended={isExtended}
                onPress={() => {
                    setDialog(true);
                }}
                visible={visible}
                animateFrom={'right'}
                iconMode={'static'}
                style={[styles.fabStyle]}
            />
            <AddLocationDialog visible={dialog} hideDialog={async () => {
                await updateList();
                setDialog(false);
            }}/>
            {
                appUpdateLink &&
                <AppUpdate downloadLink={appUpdateLink.appURL} version={appUpdateLink.version} hideDialog={() => {
                    setUpdateDialog(false);
                }} visible={updateDialog}/>
            }

            <SnackbarCustom
                message={`Geofence is already runnning. Kindly stop ${sessionState.getGeofenceData()?.name} first!`}
                visible={snackVisible}
                onDismiss={function (): void {
                    setSnackVisible(false);
                }}/>

        </SafeAreaView>
    );


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});
export default HomeScreen