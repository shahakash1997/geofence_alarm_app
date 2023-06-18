export enum ColorTheme {
    LIGHT = 'light',
    DARK = 'dark',
}

const tintColor = '#4e9bde';
const darkTintColor = '#1a74b3';
const primaryButton = '#5B80F8';
const exitButton = '#DC2626';

export default {
    [ColorTheme.LIGHT]: {
        tintColor,
        darkTintColor,
        primaryButton,
        exitButton,
    },
    [ColorTheme.DARK]: {
        tintColor: darkTintColor,
        darkTintColor: tintColor,
    },
};
