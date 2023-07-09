package com.myleapps.localGeofenceApp.services;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import javax.annotation.Nullable;

public class GeofenceStopService extends HeadlessJsTaskService {

    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    "STOP_GEOFENCING",
                    Arguments.fromBundle(extras),
                    5000, // timeout in milliseconds for the task
                    false // optional: defines whether or not the task is allowed in foreground. Default is false
            );
        }
        return null;
    }
}