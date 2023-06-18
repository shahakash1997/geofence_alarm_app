export interface SavedLocation {
    id: number
    name: string
    createdOn: number
    updatedOn: number
    latitude: number;
    /**
     * The longitude in degrees.
     */
    longitude: number;
    /**
     * The altitude in meters above the WGS 84 reference ellipsoid.
     */
    altitude?: number;
    /**
     * The radius of uncertainty for the location, measured in meters.
     */
    accuracy?: number;
}

