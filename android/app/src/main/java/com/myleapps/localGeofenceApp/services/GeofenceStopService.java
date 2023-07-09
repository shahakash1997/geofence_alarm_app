package com.myleapps.localGeofenceApp.services;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.myleapps.localGeofenceApp.utils.Logger;

import javax.annotation.Nullable;

public class GeofenceStopService extends HeadlessJsTaskService {
    private static final String TAG = "GeofenceStopService";

    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Logger.debug(TAG, "getTaskConfig : START HEADLESS SERVICE");
        Bundle extras = intent.getExtras();
        WritableMap data = extras != null ? Arguments.fromBundle(extras) : Arguments.createMap();
        return new HeadlessJsTaskConfig(
                "STOP_GEOFENCING",
                data,
                5000,
                true // optional: defines whether or not the task is allowed in foreground. Default is false
        );
    }
}