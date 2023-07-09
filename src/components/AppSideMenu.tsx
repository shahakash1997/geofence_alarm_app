import * as React from 'react';
import {View} from 'react-native';
import {Button, Divider, Menu, PaperProvider} from 'react-native-paper';
import {Routes} from "../constants/Routes";

export interface AppSideMenuProps {
    navigation: any
}

const AppSideMenu = (props: AppSideMenuProps) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <PaperProvider>
            <View
                style={{
                    paddingTop: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Button onPress={openMenu}>Show menu</Button>}>
                    <Menu.Item onPress={() => {
                        props.navigation.navigate(Routes.SETTINGS_SCREEN);
                    }} title="Settings"/>
                    <Menu.Item onPress={() => {
                    }} title="No Item(TBD)"/>
                    <Divider/>
                    <Menu.Item onPress={() => {
                    }} title="No Item(TBD)"/>
                </Menu>
            </View>
        </PaperProvider>
    );
};

export default AppSideMenu;