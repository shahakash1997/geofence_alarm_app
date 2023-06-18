import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const IconButton = ({
                        title,
                        onPress,
                        icon,
                        style,
                        textStyles,
                    }: {
    title: string;
    onPress: (e: any) => void;
    icon?: any;
    style?: any;
    textStyles?: any;
}) => (
    <TouchableOpacity style={style} onPress={onPress}>
        <View
            style={{
                flex: 1,
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <Text style={textStyles}>{title}</Text>
            {icon}
        </View>
    </TouchableOpacity>
);

export default IconButton;
