import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';

const ProgressDialog = (props: ProgressDialogProps) => {
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
            }}>
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="rgba(107, 142, 255, 1)"/>
                    <Text style={[styles.label]}>{props.label}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    label: {
        color: 'black',
        textAlign: 'center',
        fontStyle: 'normal',
        fontSize: 15,
    },
    content: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
});

export default ProgressDialog;

export interface ProgressDialogProps {
    visible: boolean;
    label: string;
}
