import React from 'react';
import {Animated, SafeAreaView, StyleProp, StyleSheet, Text, View, ViewStyle,} from 'react-native';
import {Surface, withTheme} from 'react-native-paper';
import {AntDesign} from '@expo/vector-icons';
import {Fonts} from "../styles/CommonStyles";

export interface SnackbarProps {
    visible: boolean;
    duration?: number;
    /**
     * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
     */
    onDismiss: () => void;
    /**
     * Text content of the Snackbar.
     */
    message: string;
    type?: SnackBarType;
    // @ts-ignore
    theme: ReactNativePaper.Theme;
}

const DURATION_MEDIUM = 1000;

export enum SnackBarType {
    SUCCESS,
    FAILURE,
}

const SnackbarCustom = ({
                            visible,
                            duration = DURATION_MEDIUM,
                            onDismiss,
                            message,
                            theme,
                            type,
                        }: SnackbarProps) => {
    const {current: opacity} = React.useRef<Animated.Value>(
        new Animated.Value(0.0),
    );
    const [hidden, setHidden] = React.useState<boolean>(!visible);

    // @ts-ignore
    const hideTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const {scale} = theme.animation;

    React.useEffect(() => {
        return () => {
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, []);

    React.useLayoutEffect(() => {
        if (visible) {
            // show
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current);
            }
            setHidden(false);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200 * scale,
                useNativeDriver: true,
            }).start(({finished}) => {
                if (finished) {
                    const isInfinity =
                        duration === Number.POSITIVE_INFINITY ||
                        duration === Number.NEGATIVE_INFINITY;

                    if (finished && !isInfinity) {
                        hideTimeout.current = setTimeout(
                            onDismiss,
                            duration, // @ts-ignore
                        ) as NodeJS.Timeout;
                    }
                }
            });
        } else {
            // hide
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current);
            }

            Animated.timing(opacity, {
                toValue: 0,
                duration: 100 * scale,
                useNativeDriver: true,
            }).start(({finished}) => {
                if (finished) {
                    setHidden(true);
                }
            });
        }
    }, [visible, duration, opacity, scale, onDismiss]);

    const {colors, roundness} = theme;

    if (hidden) {
        return null;
    }

    if (!message) {
        return null;
    }

    return (
        <SafeAreaView pointerEvents="box-none" style={[styles.wrapper]}>
            <Surface
                pointerEvents="box-none"
                accessibilityLiveRegion="polite"
                style={
                    [
                        styles.container,
                        {
                            borderRadius: roundness,
                            opacity: opacity,
                            transform: [
                                {
                                    scale: visible
                                        ? opacity.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.9, 1],
                                        })
                                        : 1,
                                },
                            ],
                        },
                        {backgroundColor: colors.onSurface},
                    ] as StyleProp<ViewStyle>
                }>
                <View
                    style={
                        type && type === SnackBarType.FAILURE ? styles.fail : styles.main
                    }>
                    {type && type === SnackBarType.FAILURE ? (
                        <AntDesign name="exclamationcircleo" size={20} color="white"/>
                    ) : (
                        <AntDesign name="checkcircleo" size={20} color="white"/>
                    )}
                    <Text style={styles.messageStyle}>{message}</Text>
                    <AntDesign
                        name="close"
                        size={16}
                        color="white"
                        onPress={() => {
                            setHidden(true);
                        }}
                    />
                </View>
            </Surface>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
    },
    container: {
        elevation: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 8,
        borderRadius: 4,
    },
    main: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        flex: 1,
    },
    fail: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FA3A2E',
        flex: 1,
    },
    messageStyle: {
        flex: 1,
        marginStart: 20,
        marginEnd: 20,
        color: '#ffffff',
        fontWeight: '600',
        fontFamily: Fonts.IBMPlexSans_600SemiBold,
    },
});

export default withTheme(SnackbarCustom);
