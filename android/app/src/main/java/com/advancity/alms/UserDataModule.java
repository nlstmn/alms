package com.advancity.alms;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.microsoft.windowsazure.messaging.NotificationHub;

import javax.annotation.Nonnull;

/**
 * Created by moter on 09.09.2019.
 */
public class UserDataModule extends ReactContextBaseJavaModule {
    private static final String TAG = "UserDataModule";
    String FCM_token = null;

    public UserDataModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() { //javascript acessing name
        return "UserDataModule";
    }

    @ReactMethod
    public void userData(String userId, String organizationId) {

        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getReactApplicationContext());
        String resultString = null;
        String regID = null;
        String storedToken = null;


        FCM_token = sharedPreferences.getString("FCMtoken", null);
        // Storing the registration ID that indicates whether the generated token has been
        // sent to your server. If it is not stored, send the token to your server.
        // Otherwise, your server should have already received the token.
        try {

            if (((regID = sharedPreferences.getString("registrationID", null)) == null)) {

                NotificationHub hub = new NotificationHub(NotificationSettings.HubName,
                        NotificationSettings.HubListenConnectionString, getReactApplicationContext());
                Log.d(TAG, "Attempting a new registration with NH using FCM token : " + FCM_token);
                regID = hub.register(FCM_token, userId, organizationId).getRegistrationId();

                // If you want to use tags...
                // Refer to : https://azure.microsoft.com/documentation/articles/notification-hubs-routing-tag-expressions/
                // regID = hub.register(token, "tag1,tag2").getRegistrationId();

                resultString = "New NH Registration Successfully - RegId : " + regID;
                Log.d(TAG, resultString);

                sharedPreferences.edit().putString("registrationID", regID).apply();
//            sharedPreferences.edit().putString("FCMtoken", FCM_token).apply();
            }

            // Check to see if the token has been compromised and needs refreshing.
            else if ((storedToken = sharedPreferences.getString("FCMtoken", "")) != FCM_token) {

                NotificationHub hub = new NotificationHub(NotificationSettings.HubName,
                        NotificationSettings.HubListenConnectionString, getReactApplicationContext());
                Log.d(TAG, "NH Registration refreshing with token : " + FCM_token);
                regID = hub.register(FCM_token, userId, organizationId).getRegistrationId();

                // If you want to use tags...
                // Refer to : https://azure.microsoft.com/documentation/articles/notification-hubs-routing-tag-expressions/
                // regID = hub.register(token, "tag1,tag2").getRegistrationId();

                resultString = "New NH Registration Successfully - RegId : " + regID;
                Log.d(TAG, resultString);

                sharedPreferences.edit().putString("registrationID", regID).apply();
//                sharedPreferences.edit().putString("FCMtoken", FCM_token).apply();
            } else {
                resultString = "Previously Registered Successfully - RegId : " + regID;
            }
        } catch (Exception e) {
            Log.e(TAG, resultString = "Failed to complete registration", e);

        }

        //Toast.makeText(getReactApplicationContext(), "userId: " + userId + " kurum id: " + organizationId  + " token: " + FCM_token, Toast.LENGTH_LONG).show();
    }
}
