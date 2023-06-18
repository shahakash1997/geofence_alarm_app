import type {SQLResultSet, WebSQLDatabase} from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as DBConfig from './DBConfig';
import {isEmptyOrBlank} from "../utils/utils";

let dbConnection: WebSQLDatabase | null;

function openDatabase(): WebSQLDatabase {
    return SQLite.openDatabase(DBConfig.DATABASE_NAME);
}

export function executeQuery(
    query: string,
    args: any[]
): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
        if (isEmptyOrBlank(query)) {
            reject(
                new Error('SQL Query is null or empty')
            );
            return;
        }
        if (!dbConnection) dbConnection = openDatabase();
        dbConnection.transaction((tx) => {
            tx.executeSql(
                query,
                args,
                (_, sqlResultSet) => {
                    resolve(sqlResultSet);
                },
                (_, sqlError) => {
                    reject(sqlError);
                    return false;
                }
            );
        });
    });
}
