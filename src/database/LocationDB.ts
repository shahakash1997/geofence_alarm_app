import type {SQLResultSet} from 'expo-sqlite';
import * as Database from './database';
import {SAVED_LOCATIONS_TABLE, SL_COLUMN} from "./DBConfig";
import {SavedLocation} from "../models/models";

export default class LocationDB {
    private static instance: LocationDB;

    private constructor() {
    }

    public static async getInstance(): Promise<LocationDB> {
        if (!LocationDB.instance) {
            let managerInstance = new LocationDB();
            await managerInstance.init();
            LocationDB.instance = managerInstance;
        }
        return LocationDB.instance;
    }

    public async init(): Promise<void> {
        await Database.executeQuery(
            `CREATE TABLE IF NOT EXISTS ${SAVED_LOCATIONS_TABLE} (\
                    ${SL_COLUMN.id} INTEGER PRIMARY KEY AUTOINCREMENT,\
                    ${SL_COLUMN.name} TEXT NOT NULL,\
                    ${SL_COLUMN.createdOn} INTEGER NOT NULL DEFAULT 0,\
                    ${SL_COLUMN.updatedOn} INTEGER NOT NULL DEFAULT 0,\
                    ${SL_COLUMN.latitude} INTEGER NOT NULL,\
                    ${SL_COLUMN.longitude} INTEGER NOT NULL,\
                    ${SL_COLUMN.altitude} INTEGER DEFAULT 0,\
                    ${SL_COLUMN.accuracy} INTEGER DEFAULT 0);`,
            []
        );
    }

    public async insertSavedLocation(
        savedLocation: SavedLocation
    ): Promise<SQLResultSet> {
        return await Database.executeQuery(
            `INSERT INTO ${SAVED_LOCATIONS_TABLE}(\
                                    ${SL_COLUMN.name},\
                                    ${SL_COLUMN.createdOn},\
                                    ${SL_COLUMN.updatedOn},\
                                    ${SL_COLUMN.latitude},\
                                    ${SL_COLUMN.longitude}, \
                                    ${SL_COLUMN.altitude},\
                                    ${SL_COLUMN.accuracy})\
                                    values (?,?,?,?,?,?,?)`,
            [
                savedLocation.name,
                savedLocation.createdOn,
                savedLocation.updatedOn,
                savedLocation.latitude,
                savedLocation.longitude,
                savedLocation.altitude,
                savedLocation.accuracy
            ]
        );
    }

    public async getAllLocations(): Promise<SavedLocation[]> {
        const resultSet = await Database.executeQuery(
            `SELECT * FROM ${SAVED_LOCATIONS_TABLE};`,
            []
        );
        return resultSet.rows._array;
    }
    public async getById(id:number): Promise<SavedLocation> {
        const resultSet = await Database.executeQuery(
            `SELECT * FROM ${SAVED_LOCATIONS_TABLE} where ${SL_COLUMN.id} = ?;`,
            [id]
        );
        return resultSet.rows._array[0];
    }

    public async updateLocation(newLocation: SavedLocation): Promise<number> {
        try {
            const resultSet = await Database.executeQuery(
                `UPDATE ${SAVED_LOCATIONS_TABLE} SET ${SL_COLUMN.name} = ?,${SL_COLUMN.latitude} = ?,${SL_COLUMN.longitude} = ?,${SL_COLUMN.updatedOn} = ?  WHERE ${SL_COLUMN.id} = ?;`,
                [newLocation.name, newLocation.latitude, newLocation.longitude, new Date().valueOf(), newLocation.id]
            );
            return resultSet.rowsAffected;
        } catch (error: any) {
            return 0;
        }
    }

    public async deleteLocation(loc: SavedLocation): Promise<boolean> {
        try {
            const resultSet = await Database.executeQuery(
                `DELETE FROM ${SAVED_LOCATIONS_TABLE} WHERE ${SL_COLUMN.id} = ?;`,
                [loc.id]
            );
            return true;
        } catch (error: any) {
            return false;
        }
    }
}
