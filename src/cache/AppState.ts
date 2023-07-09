import {hookstate, useHookstate} from '@hookstate/core';
import {SavedLocation} from "../models/models";

export interface AppSessionInterface {
    geofenceRunning: boolean
    lastGeofenceData: SavedLocation | null
    savedLocations: SavedLocation[]
}

const lastLoc: SavedLocation | null = null

const initialGlobalState = hookstate({
    geofenceRunning: false,
    lastGeofenceData: lastLoc,
    savedLocations: []
});

export const useGlobalSessionState = () => {
    const currentAppSession = useHookstate<AppSessionInterface>(initialGlobalState);
    return {
        isGeofenceRunning: () => currentAppSession.get().geofenceRunning,
        getGeofenceData: () => currentAppSession.get().lastGeofenceData,
        getSavedLocations: () => currentAppSession.get().savedLocations,

        setAppSession: (started: boolean, location: SavedLocation | null) => {
            currentAppSession.geofenceRunning.set(started);
            currentAppSession.lastGeofenceData.set(location);
        },
        setSavedLocations: (locations: SavedLocation[]) => {
            currentAppSession.savedLocations.set(locations);
        }
    };
};
