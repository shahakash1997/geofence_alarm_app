import * as React from 'react';
import {SavedLocation} from "../models/models";
import {useNavigation} from "@react-navigation/native";
import {Card, Text} from "react-native-paper";

interface LocationItemProps {
    data: SavedLocation,
    onClick: (item: SavedLocation) => void

}

const LocationItem = (props: LocationItemProps) => {
    const navigation = useNavigation();
    return (
        <Card style={{marginTop: 5, marginStart: 10, marginEnd: 10, marginBottom: 5}} onPress={() => {
            props.onClick(props.data);
        }}>
            <Card.Content>
                <Text variant="titleLarge">{props.data.name}</Text>
                <Text
                    variant="bodyMedium">{`Latitude:${props.data.latitude}\nLongitude:${props.data.longitude}`}</Text>
            </Card.Content>
        </Card>
    );

}


export default LocationItem;