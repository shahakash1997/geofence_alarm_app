import * as React from 'react';
import {useState} from 'react';
import {Button, Modal, Paragraph, TextInput, Title} from 'react-native-paper';
import {AppStylesSecondary, CommonStyles, Fonts} from "../styles/CommonStyles";
import {KeyboardAvoidingView, StyleSheet, View} from "react-native";
import {showToast} from "./Toaster";
import {SavedLocation} from "../models/models";
import LocationDB from "../database/LocationDB";


export interface AddLocationDialog {
    visible: boolean
    hideDialog: () => void
}

const AddLocationDialog = (etProps: AddLocationDialog) => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');


    return (

        <Modal
            onDismiss={etProps.hideDialog}
            dismissable={false}
            visible={etProps.visible}
            contentContainerStyle={AppStylesSecondary.modalContent}
        >
            <KeyboardAvoidingView style={[styles.wrapper]}>
                <Title style={[styles.title, {color: 'grey'}]}>
                    {'Add new Location'}
                </Title>
                <Paragraph>
                    {'Please Enter correct Location upto 4 decimal places'}
                </Paragraph>
                <TextInput
                    mode={'outlined'}
                    label="Name"
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <View style={{flexDirection: 'row', marginTop: 12}}>
                    <TextInput
                        style={{flex: 1, marginEnd: 2.5}}
                        mode={'outlined'}
                        label="Latitude"
                        keyboardType={'numeric'}
                        value={latitude}
                        onChangeText={text => setLatitude(text)}
                    />
                    <TextInput
                        style={{flex: 1, marginStart: 2.5}}
                        mode={'outlined'}
                        keyboardType={'numeric'}
                        label="Longitude"
                        value={longitude}
                        onChangeText={text => setLongitude(text)}
                    />
                </View>

                <Button
                    mode={'contained'}
                    uppercase={false}
                    labelStyle={CommonStyles.nextButtonLabel}
                    style={[
                        CommonStyles.nextButton,
                        {
                            marginTop: 20,
                        },
                    ]}
                    onPress={async () => {
                        try {
                            if (name && parseFloat(latitude) && parseFloat(longitude)) {
                                let savedLocation: SavedLocation;
                                savedLocation = {
                                    name: name,
                                    id: new Date().valueOf(),
                                    createdOn: new Date().valueOf(),
                                    updatedOn: new Date().valueOf(),
                                    latitude: parseFloat(latitude),
                                    longitude: parseFloat(longitude)
                                }
                                const db = await LocationDB.getInstance();
                                await db.insertSavedLocation(savedLocation);
                                etProps.hideDialog();
                            }

                        } catch (error: any) {
                            showToast(error.message);
                        }
                    }}
                >
                    Save
                </Button>
            </KeyboardAvoidingView>
        </Modal>

    );
};
export default AddLocationDialog;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 28,
        textAlign: 'center',
        color: '#111111',
        fontFamily: Fonts.IBMPlexSans_600SemiBold,
    },
    message1: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: 20,
        textAlign: 'center',
        color: '#111111',
        marginTop: 12,
        fontFamily: Fonts.IBMPlexSans_400Regular,
    },

    content: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        width: '80%',
    },
    wrapper: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,

    },
});
