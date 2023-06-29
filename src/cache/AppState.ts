import {hookstate, useHookstate} from '@hookstate/core';
import {SavedLocation} from "../models/models";

export interface AppSessionInterface {
    geofenceRunning: boolean
    lastGeofenceData: SavedLocation | null
}

const lastLoc: SavedLocation | null = null

const initialGlobalState = hookstate({
    geofenceRunning: false,
    lastGeofenceData: lastLoc,
});

export const useGlobalSessionState = () => {
    const currentAppSession = useHookstate<AppSessionInterface>(initialGlobalState);
    return {
        isGeofenceRunning: () => currentAppSession.get().geofenceRunning,
        getGeofenceData: () => currentAppSession.get().lastGeofenceData,

        setAppSession: (started: boolean, location: SavedLocation | null) => {
            currentAppSession.set({
                geofenceRunning: started,
                lastGeofenceData: location
            })
        }
    };
};
