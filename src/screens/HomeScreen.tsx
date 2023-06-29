import React, {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import {SavedLocation} from "../models/models";
import {FlashList} from "@shopify/flash-list";
import {AnimatedFAB, Chip, Text} from "react-native-paper";
import AddLocationDialog from "../components/AddLocationDialog";
import LocationDB from "../database/LocationDB";
import LocationItem from "../components/LocationItem";
import {AppStylesSecondary} from "../styles/CommonStyles";
import {Routes} from "../constants/Routes";
import LocationManager from "../utils/LocationManager";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";
import SnackbarCustom from "../widgets/SnackbarCustom";
import {useGlobalSessionState} from "../cache/AppState";


const handleEmpty = () => {
    return (
        <Text style={[AppStylesSecondary.titleText, {fontSize: 20, padding: 20}]}>{' No locations present!'}</Text>);
};

const locationManager = LocationManager.getInstance();
const cache = AppLocalStorage.getInstance();
const HomeScreen = ({navigation}: any) => {
    const [locations, setLocations] = useState<SavedLocation[]>([]);
    const [visible, setVisible] = useState(true);
    const [isExtended, setExtended] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [snackVisible, setSnackVisible] = useState<boolean>(false);
    const sessionState = useGlobalSessionState();
    const [listRefreshing, setListRefreshing] = useState(false);


    //when app is opened for first time
    useEffect(() => {
        (async () => {
            const lastLocation = await cache.getObjectFromCache(CACHE_KEYS.LAST_GEOFENCE);
            if (lastLocation) {
                sessionState.setAppSession(true, lastLocation);
            }
        })();
    }, []);
    const updateList = async () => {
        const db = await LocationDB.getInstance();
        const locations = await db.getAllLocations();
        setLocations(locations);

    };

    useEffect(() => {
        (async () => {
            await updateList();
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
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
                    data={locations}
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