import * as React from 'react';
import {useState} from 'react';
import {Button, MD3Colors, Modal, ProgressBar, Title} from 'react-native-paper';
import {AppStylesSecondary, CommonStyles, Fonts} from "../styles/CommonStyles";
import {KeyboardAvoidingView, StyleSheet, View} from "react-native";
import {AppAutoUpdateUtils} from "../utils/AppAutoUpdateUtils";
import AppLocalStorage, {CACHE_KEYS} from "../cache/AppLocalStorage";

export interface AppUpdateProps {
    downloadLink: string
    version: string
    hideDialog: () => void
    visible: boolean
}

const appUpdateUtils = new AppAutoUpdateUtils();
const cache = AppLocalStorage.getInstance();

const AppUpdate = (etProps: AppUpdateProps) => {
    const [btnLoading, setLoading] = useState(false);
    const [progress, setProgress] = useState<number>();

    return (
        <Modal
            onDismiss={etProps.hideDialog}
            dismissable={false}
            visible={etProps.visible}
            contentContainerStyle={AppStylesSecondary.modalContent}
        >
            <KeyboardAvoidingView style={[styles.wrapper]}>
                <Title style={[styles.title, {color: 'grey'}]}>
                    {'UPDATE AVAILABLE'}
                </Title>
                {
                    progress &&
                    <ProgressBar progress={progress} color={MD3Colors.error50}/>
                }
                {
                    !progress && <View style={{flexDirection: 'column'}}>
                        <Button
                            style={[CommonStyles.cancelButton, {marginBottom: 2, marginTop: 25}]}
                            loading={btnLoading}
                            mode="outlined"
                            onPress={async () => {
                                etProps.hideDialog();
                            }
                            }>
                            SKIP
                        </Button>
                        <Button
                            style={[CommonStyles.nextButton, {marginTop: 2}]}
                            loading={btnLoading}
                            mode="contained"
                            onPress={async () => {
                                await appUpdateUtils.downloadUpdate(etProps.downloadLink, etProps.version, (progress) => {
                                    if (progress) {
                                        const p = (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100;
                                        setProgress(p);
                                        if (progress.totalBytesWritten === progress.totalBytesExpectedToWrite) {
                                            etProps.hideDialog();
                                        }
                                    }
                                });
                                await cache.setKeyInCache(CACHE_KEYS.LAST_UPDATED, new Date().toLocaleDateString());
                            }
                            }>
                            DOWNLOAD UPDATE
                        </Button>

                    </View>
                }
            </KeyboardAvoidingView>
        </Modal>

    );
};
export default AppUpdate;

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
