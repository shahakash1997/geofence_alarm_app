import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {Button, Paragraph, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SdkColors, {ColorTheme} from "../styles/SdkColors";
import {CommonStyles, Fonts} from "../styles/CommonStyles";

const AlertDialog = (props: CancelDialogProps) => {
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
            }}>
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    {props.showIcon && props.iconName && (
                        <Icon
                            style={{alignSelf: 'center'}}
                            size={34}
                            name={props.iconName}
                            color={SdkColors[ColorTheme.LIGHT].primaryButton}
                        />
                    )}
                    <Title
                        style={{
                            fontFamily: Fonts.IBMPlexSans_600SemiBold,
                            marginTop: 0,
                            marginBottom: 15,
                            textAlign: 'center',
                            color: '#000000',
                        }}>
                        {props.label ?? 'Cancel Order'}
                    </Title>
                    {props.message && (
                        <Paragraph
                            style={{
                                textAlign: 'center',
                                fontSize: 14,
                                fontFamily: Fonts.IBMPlexSans_400Regular,
                            }}>
                            {props.message}
                        </Paragraph>
                    )}
                    <View style={{marginTop: 20}}>
                        <Button
                            mode={'outlined'}
                            uppercase={false}
                            labelStyle={CommonStyles.nextButtonLabel}
                            style={CommonStyles.nextButton}
                            onPress={() => {
                                props.onSubmit(true);
                            }}
                            testID="primary">
                            {props.positiveButtonTitle ?? 'Yes'}
                        </Button>
                        <Button
                            uppercase={false}
                            mode={'outlined'}
                            labelStyle={CommonStyles.cancelButtonLabel}
                            style={[CommonStyles.cancelButton, {marginTop: 10}]}
                            onPress={async () => {
                                props.onSubmit(false);
                            }}
                            testID="secondary">
                            {props.negativeButtonTitle ?? 'No'}
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        width: '80%',
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
});

export default AlertDialog;

export interface CancelDialogProps {
    visible: boolean;
    onSubmit: (success: boolean) => void;
    label?: string;
    message?: string;
    positiveButtonTitle?: string;
    negativeButtonTitle?: string;
    showIcon?: boolean;
    iconName?: string;
}
