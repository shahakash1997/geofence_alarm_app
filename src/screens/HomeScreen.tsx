import React, {useEffect, useState} from "react";
import {Platform, SafeAreaView, StyleSheet, View} from "react-native";
import {SavedLocation} from "../models/models";
import {FlashList} from "@shopify/flash-list";
import {AnimatedFAB, Text} from "react-native-paper";
import AddLocationDialog from "../components/AddLocationDialog";
import LocationDB from "../database/LocationDB";
import LocationItem from "../components/LocationItem";
import {AppStylesSecondary} from "../styles/CommonStyles";
import {Routes} from "../constants/Routes";


const handleEmpty = () => {
    return (
        <Text style={[AppStylesSecondary.titleText, {fontSize: 20, padding: 20}]}>{' No locations present!'}</Text>);
};
const HomeScreen = ({navigation}: any) => {
    const [locations, setLocations] = useState<SavedLocation[]>([]);
    const [visible, setVisible] = useState(true);
    const [isExtended, setExtended] = useState(false);
    const [dialog, setDialog] = useState(false);
    const isIOS = Platform.OS === 'ios';

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
                <FlashList
                    ListEmptyComponent={handleEmpty}
                    data={locations}
                    renderItem={({item}) => <LocationItem data={item} onClick={(item) => {
                        navigation.navigate(Routes.GEOFENCE_SCREEN, {...item});
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