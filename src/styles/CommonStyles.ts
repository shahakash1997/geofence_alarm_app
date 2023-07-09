import {StyleSheet} from 'react-native';
import SdkColors, {ColorTheme} from './SdkColors';

export enum Fonts {
    IBMPlexSans_400Regular = 'IBMPlexSans_400Regular',
    IBMPlexSans_600SemiBold = 'IBMPlexSans_600SemiBold',
    IBMPlexSans_300Light = 'IBMPlexSans_300Light',
    IBMPlexSans_700Bold = 'IBMPlexSans_700Bold',
    IBMPlexSans_100Thin = 'IBMPlexSans_100Thin',
    IBMPlexSans_100Thin_Italic = 'IBMPlexSans_100Thin_Italic',
    IBMPlexSans_200ExtraLight = 'IBMPlexSans_200ExtraLight',
    IBMPlexSans_200ExtraLight_Italic = 'IBMPlexSans_200ExtraLight_Italic',
    IBMPlexSans_300Light_Italic = 'IBMPlexSans_300Light_Italic',
    IBMPlexSans_400Regular_Italic = 'IBMPlexSans_400Regular_Italic',
    IBMPlexSans_500Medium = 'IBMPlexSans_500Medium',
    IBMPlexSans_500Medium_Italic = 'IBMPlexSans_500Medium_Italic',
    IBMPlexSans_600SemiBold_Italic = 'IBMPlexSans_600SemiBold_Italic',
    IBMPlexSans_700Bold_Italic = 'IBMPlexSans_700Bold_Italic',
}

export const app = StyleSheet.create({
    item: {
        padding: 2,
        marginTop: 8,
    },
    title: {
        fontSize: 16,
    },
    footerButtonStyles: {
        flexDirection: 'row',
        width: '100%',
    },
    input: {
        marginTop: 12,
        marginBottom: 10,
    },
    footerComponent: {
        flex: 1,
        marginStart: 8,
        marginEnd: 8,
        marginRight: 8,
        width: '100%',
        position: 'absolute',
        bottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontStyle: 'normal',
    },
});
export const CommonStyles = StyleSheet.create({
    alignCenter: {
        flex: 1,
        alignItems: 'center',
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    nextButton: {
        backgroundColor: SdkColors[ColorTheme.LIGHT].primaryButton,
    },
    nextButtonLabel: {
        color: '#ffffff',
        fontFamily: Fonts.IBMPlexSans_600SemiBold,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 1.56,
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '600',
    },
    cancelButton: {
        borderColor: SdkColors[ColorTheme.LIGHT].primaryButton,
    },
    cancelButtonLabel: {
        color: SdkColors[ColorTheme.LIGHT].primaryButton,
        fontFamily: Fonts.IBMPlexSans_600SemiBold,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 1.56,
        textAlign: 'center',
        fontStyle: 'normal',
    },
    exitButton: {
        borderWidth: 1,
        borderColor: SdkColors[ColorTheme.LIGHT].exitButton,
    },
    exitButtonLabel: {
        color: SdkColors[ColorTheme.LIGHT].exitButton,
        fontFamily: Fonts.IBMPlexSans_600SemiBold,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 1.56,
        textAlign: 'center',
        fontStyle: 'normal',
    },
    bottom: {
        justifyContent: 'flex-end',
    },
});
export const secondaryStyles = StyleSheet.create({
    itemTextStyle: {
        fontFamily: Fonts.IBMPlexSans_400Regular,
        color: '#111111',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgba(61, 68, 92, 0.7)',
    },
    modalContent: {
        marginStart: 60,
        marginEnd: 60,
        flex: 1,
        marginBottom: 60,
    },
    flatList: {
        marginTop: 7,
    },
    modalView: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 9,
    },
    titleText: {
        justifyContent: 'center',
        fontFamily: Fonts.IBMPlexSans_600SemiBold,
        fontStyle: 'normal',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: '#111111',
    },
    messageText: {
        marginTop: 10,
        justifyContent: 'center',
        fontFamily: Fonts.IBMPlexSans_400Regular,
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: '#000000',
    },
});

export const AppStylesSecondary = StyleSheet.create({
    itemTextStyle: {
        fontFamily: Fonts.IBMPlexSans_400Regular,
        color: '#111111',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgba(61, 68, 92, 0.7)',
    },
    modalContent: {
        marginStart: 40,
        marginEnd: 40,
        marginBottom: 40,
        marginTop: 50,
        borderRadius: 10,
    },
    flatList: {
        marginTop: 7,
    },
    modalView: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
    },
    titleText: {
        justifyContent: 'center',
        fontFamily: Fonts.IBMPlexSans_600SemiBold,
        fontStyle: 'normal',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: '#111111',
    },
    messageText: {
        marginTop: 10,
        justifyContent: 'center',
        fontFamily: Fonts.IBMPlexSans_400Regular,
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: '#000000',
    },
});

