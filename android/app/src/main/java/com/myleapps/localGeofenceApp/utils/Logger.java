package com.myleapps.localGeofenceApp.utils;

import android.util.Log;

public class Logger {
    public static void debug(String TAG, String message) {
        Log.d(TAG, ": " + message);
    }
}
