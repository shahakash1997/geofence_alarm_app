package com.myleapps.localGeofenceApp

import android.location.Location
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import javax.annotation.Nonnull

class AppUtilsModule(private val mReactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(mReactContext) {
    companion object {
        private const val TAG = "AppUtilsModule"
        const val MODULE_NAME = "NativeAppUtils"
    }

    @Nonnull
    override fun getName(): String {
        return MODULE_NAME
    }

    /**
     * interval should be time in millis
     */

    @ReactMethod
    fun getDistance(lat1: Double, long1: Double, lat2: Double, long2: Double, promise: Promise) {
        val fromLocation = Location("FROM")
        fromLocation.latitude = lat1
        fromLocation.longitude = long1
        val toLocation = Location("TO")
        toLocation.latitude= lat2
        toLocation.longitude = long2

        promise.resolve(fromLocation.distanceTo(toLocation))
    }

    @ReactMethod
    fun playSoundInBackground() {

    }
}