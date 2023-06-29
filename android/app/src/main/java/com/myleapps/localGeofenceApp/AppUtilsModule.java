package com.myleapps.localGeofenceApp;

import android.content.Intent;
import android.location.Location;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.myleapps.localGeofenceApp.services.GeofenceBannerService;

class AppUtilsModule extends ReactContextBaseJavaModule {
    private static String MODULE_NAME = "AppUtilsModule";
    private ReactApplicationContext mReactContext;

    public AppUtilsModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.mReactContext = reactApplicationContext;
    }


    @ReactMethod
    public void getDistance(Double lat1, Double long1, Double lat2, Double long2, Promise promise) {
        Location fromLocation = new Location("FROM");
        fromLocation.setLatitude(lat1);
        fromLocation.setLongitude(long1);
        Location toLocation = new Location("TO");
        toLocation.setLatitude(lat2);
        toLocation.setLongitude(long2);
        promise.resolve(fromLocation.distanceTo(toLocation));
    }

    @ReactMethod
    public void showBannerAndPlaySound(Promise promise) {
        try {
            //todo show foreground service
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                this.mReactContext.startForegroundService(new Intent(this.mReactContext, GeofenceBannerService.class));
            } else {
                this.mReactContext.startService(new Intent(this.mReactContext, GeofenceBannerService.class));

            }
            promise.resolve(true);

        } catch (Exception e) {
            promise.reject(e);
        }


    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }
}