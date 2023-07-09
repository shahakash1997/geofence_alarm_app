package com.myleapps.localGeofenceApp.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.media3.common.MediaItem;
import androidx.media3.common.MimeTypes;
import androidx.media3.common.Player;
import androidx.media3.datasource.DefaultDataSource;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.MediaSource;
import androidx.media3.exoplayer.source.ProgressiveMediaSource;

import com.facebook.react.HeadlessJsTaskService;
import com.myleapps.localGeofenceApp.MainActivity;
import com.myleapps.localGeofenceApp.R;
import com.myleapps.localGeofenceApp.utils.Logger;

public class GeofenceBannerService extends Service {
    private static final String TAG = "GeofenceBannerService";
    private WindowManager mWindowManager;
    private View mGeofenceBannerView;
    private ExoPlayer exoPlayer;
    private Vibrator vibrator;
    private Boolean playSound = true;
    private Boolean vibrationEnabled = true;

    public GeofenceBannerService() {
        Logger.debug(TAG, "GeofenceBannerService : ");

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void makeForegorund() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String NOTIFICATION_CHANNEL_ID = "com.delhivery.mts";
            String channelName = "MTS Background Service";
            NotificationChannel chan = new NotificationChannel(NOTIFICATION_CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_HIGH);
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.createNotificationChannel(chan);
                Notification.Builder notificationBuilder = new Notification.Builder(getApplicationContext(), NOTIFICATION_CHANNEL_ID);
                Notification notification = notificationBuilder.setOngoing(true)
                        .setContentTitle("Geofence Alarm").setContentText("Geofence UI Service")
                        .setCategory(Notification.CATEGORY_SERVICE)
                        .build();
                startForeground(3, notification);
            }
        } else {
            Notification notification = new NotificationCompat.Builder(getApplicationContext())
                    .setContentTitle("Geofence Alarm")
                    .setContentText("Geofence UI Service").build();
            startForeground(3, notification);
        }
    }


    @Override
    public void onCreate() {
        super.onCreate();
        Logger.debug(TAG, "onCreate : ");
        makeForegorund();
        initMediaPlayer();
        vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        mGeofenceBannerView = LayoutInflater.from(this).inflate(R.layout.geofence_banner, null);
        int LAYOUT_FLAG;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            LAYOUT_FLAG = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            LAYOUT_FLAG = WindowManager.LayoutParams.TYPE_PHONE;
        }
        //Add the view to the window.
        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                LAYOUT_FLAG,
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);
        params.gravity = Gravity.CENTER;
        params.x = 0;
        params.y = 100;

        //Add the view to the window
        mWindowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        mWindowManager.addView(mGeofenceBannerView, params);
        addListenersOnView(mGeofenceBannerView, params);
    }

    private void initMediaPlayer() {
        Logger.debug(TAG, "initMediaPlayer : ");
        exoPlayer = new ExoPlayer.Builder(getApplicationContext())
                .build();
        exoPlayer.setWakeMode(PowerManager.PARTIAL_WAKE_LOCK);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Logger.debug(TAG, "onStartCommand : ");
        makeForegorund();
        playSound = intent.getBooleanExtra("sound", true);
        vibrationEnabled = intent.getBooleanExtra("vibration", true);
        playSound();
        startVibration();
        return super.onStartCommand(intent, flags, startId);
    }

    private void addListenersOnView(View mGeofenceBannerView, WindowManager.LayoutParams params) {
        mGeofenceBannerView.setOnTouchListener(new OnTouchListener() {
            private int lastAction;
            private int initialX;
            private int initialY;
            private float initialTouchX;
            private float initialTouchY;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x;
                        initialY = params.y;

                        //get the touch location
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();

                        lastAction = event.getAction();
                        return true;
                    case MotionEvent.ACTION_UP:
                        //As we implemented on touch listener with ACTION_MOVE,
                        //we have to check if the previous action was ACTION_DOWN
                        //to identify if the user clicked the view or not.
                        if (lastAction == MotionEvent.ACTION_DOWN) {
                            //Open the chat conversation click.
                            Intent intent = new Intent(GeofenceBannerService.this, MainActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                            //close the service and remove the chat heads
                            stopSelf();
                        }
                        lastAction = event.getAction();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        //Calculate the X and Y coordinates of the view.
                        params.x = initialX + (int) (event.getRawX() - initialTouchX);
                        params.y = initialY + (int) (event.getRawY() - initialTouchY);

                        //Update the layout with new X & Y coordinate
                        mWindowManager.updateViewLayout(mGeofenceBannerView, params);
                        lastAction = event.getAction();
                        return true;
                }
                return false;
            }
        });
        final Button button = mGeofenceBannerView.findViewById(R.id.close_btn);
        button.setOnClickListener(v -> {
            Toast.makeText(this, "Service Stopped!", Toast.LENGTH_SHORT).show();
            Intent service = new Intent(getApplicationContext(), GeofenceStopService.class);
            getApplicationContext().startService(service);
            HeadlessJsTaskService.acquireWakeLockNow(getApplicationContext());
            stopSelf();
        });
    }

    private void playSound() {
        if (playSound) {
            String audioFilePath = "android.resource://" + getPackageName() + "/" + R.raw.sound;
            // Create an instance of the ExoPlayer
            MediaItem mediaItem = new MediaItem.Builder()
                    .setUri(Uri.parse(audioFilePath))
                    .setMimeType(MimeTypes.BASE_TYPE_AUDIO)
                    .build();
            MediaSource mediaSource = new ProgressiveMediaSource.Factory(new DefaultDataSource.Factory(getApplicationContext())).createMediaSource(mediaItem);
            exoPlayer.setMediaSource(mediaSource);
            exoPlayer.setPlayWhenReady(true);
            exoPlayer.prepare();
            exoPlayer.setRepeatMode(Player.REPEAT_MODE_ALL);
        }
    }

    private void startVibration() {
        if (vibrationEnabled) {
            long[] pattern = new long[]{0, 400, 800, 600, 800, 800, 800, 1000};
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0));
            } else {
                //deprecated in API 26
                vibrator.vibrate(pattern, 0);
            }
        }
    }


    @Override
    public void onDestroy() {
        Logger.debug(TAG, "onDestroy : ");
        super.onDestroy();
        if (mGeofenceBannerView != null) mWindowManager.removeView(mGeofenceBannerView);
        exoPlayer.release();
        vibrator.cancel();
        exoPlayer = null;
    }

}