package com.myleapps.localGeofenceApp.utils;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import androidx.core.content.FileProvider;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Objects;
import java.util.jar.JarFile;

public class Utils {
    public static String getFormattedDate(Long timestamp) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
        return simpleDateFormat.format(timestamp);
    }

    public static void openAPKFile(String uriString, Context context) throws Exception {
        Uri apkUri = Uri.parse(uriString);
        File downloadedFile = getApkPath(apkUri);
        try {
            new JarFile(downloadedFile);
        } catch (Exception e) {
            throw new Exception("Corrupted APK file");
        }
        if (Objects.equals(getFormattedDate(Calendar.getInstance().getTimeInMillis()), getFormattedDate(downloadedFile.lastModified()))) {
            installApk(context, downloadedFile);
        } else {
            throw new Exception("Old APK File");
        }

    }

    public static void installApk(Context context, File apkFile) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        Uri apkUri = FileProvider.getUriForFile(
                context,
                context.getApplicationContext().getPackageName().toString() + ".provider",
                apkFile
        );
        intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        context.grantUriPermission(context.getPackageName(), apkUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        context.startActivity(intent);
    }

    public static File getApkPath(Uri apkUri) throws Exception {
        File file = new File(apkUri.getPath());
        if (!file.exists()) throw new Exception("File not exists");
        file.setReadable(true, false);
        file.setExecutable(true, false);
        file.setWritable(true, false);
        return file;
    }
}
