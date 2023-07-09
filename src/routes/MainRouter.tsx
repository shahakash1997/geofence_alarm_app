import * as React from 'react';
import HomeScreen from "../screens/HomeScreen";
import {NotificationScreen} from "../screens/NotificationScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {Routes} from "../constants/Routes";
import StartGeofenceScreen from "../screens/StartGeofenceScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();


const MainRouter = () => {
    return (
        <Stack.Navigator initialRouteName={Routes.HomeScreen}
                         screenOptions={{
                             headerShown: true,
                         }}>
            <Stack.Screen options={{
                headerShown: false,
                title: 'Saved Locations',
            }} name={Routes.HomeScreen} component={HomeScreen}/>
            <Stack.Screen name="Notifications" component={NotificationScreen}/>
            <Stack.Screen name={Routes.GEOFENCE_SCREEN} component={StartGeofenceScreen}/>
            <Stack.Screen name={Routes.SETTINGS_SCREEN} component={SettingsScreen}/>
        </Stack.Navigator>
    );
};

export default MainRouter;
