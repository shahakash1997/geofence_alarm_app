import React from 'react';
import MainRouter from "../routes/MainRouter";
import {StatusBar} from "expo-status-bar";


const Main = () => {
    return <>
        <StatusBar style="dark"/>
        <MainRouter/>
    </>;
}


export default Main;