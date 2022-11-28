package com.advancity.alms;

import android.app.Application;
import android.content.Intent;
import android.util.Log;


import com.facebook.react.ReactApplication;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;

import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;


//import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.brentvatne.react.ReactVideoPackage;


import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;


import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;


public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {

            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNDateTimePickerPackage(),
            new RNScreensPackage(),
                    new RNCWebViewPackage(),
                    new DocumentPickerPackage(),
//                    new RNFirebasePackage(),
//                    new RNFirebaseCrashlyticsPackage(),
                    new RNFileViewerPackage(),
                    new OrientationPackage(),
                    new ReactVideoPackage(),
                    new RNFetchBlobPackage(),
                    new NetInfoPackage(),
                    new LinearGradientPackage(),
                    new RNDeviceInfo(),
                    new AsyncStoragePackage(),
                    new VectorIconsPackage(),
                    new RNGestureHandlerPackage(),
                    new RNI18nPackage(),
                    new UserDataPackage(),
                    new AndroidKeyboardAdjustPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        Log.d("MainApplication", "onCreate");
        registerWithNotificationHubs();
    }

    public void registerWithNotificationHubs() {
//        if (checkPlayServices()) {
//            // Start IntentService to register this application with FCM.
//            Intent intent = new Intent(this, RegistrationIntentService.class);
//            startService(intent);
//        }

        Intent intent = new Intent(getApplicationContext()
                , RegistrationIntentService.class);
        startService(intent);
    }
}
