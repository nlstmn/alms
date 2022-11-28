/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

//#import <Firebase.h>

@implementation AppDelegate

@synthesize userId, organizationId;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //[FIRApp configure];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"alms"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(registerPushNotifications:(NSString *)userId forOrganization:(NSString *)organizationId)
{
  NSLog(@"registerPushNotifications worked! with userId:%@ and organizationId: %@", userId, organizationId);
  dispatch_async(dispatch_get_main_queue(),
  ^{
    [self setUserId:userId];
    [self setOrganizationId:organizationId];
    [[NSUserDefaults standardUserDefaults] setValue:userId forKey:@"userId"];
    [[NSUserDefaults standardUserDefaults] setValue:organizationId forKey:@"organizationId"];
    
  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeSound |
                                          UIUserNotificationTypeAlert | UIUserNotificationTypeBadge categories:nil];
  
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  });
  
}

- (void) application:(UIApplication *) application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *) deviceToken {
  self.userId = [[NSUserDefaults standardUserDefaults] valueForKey:@"userId"];
  self.organizationId = [[NSUserDefaults standardUserDefaults] valueForKey:@"organizationId"];
  if (self.userId != nil && self.organizationId != nil)
  {
    SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:HUBLISTENACCESS notificationHubPath:HUBNAME];

    NSSet *tagSet = [NSSet setWithArray:[NSArray arrayWithObjects:[NSString stringWithFormat:@"userId:%@", self.userId], [NSString stringWithFormat:@"organizationId:%@", self.organizationId], nil]];

    if (deviceToken != nil)
    {
      NSLog(@"deviceToken: %@", deviceToken);
      
      [hub registerNativeWithDeviceToken:deviceToken tags:tagSet completion:^(NSError* error) {
        if (error != nil) {
          NSLog(@"Error registering for notifications: %@", error);
        }
        else {
          NSLog(@"Push registeration success");
          //[self MessageBox:@"Registration Status" message:@"Registered"];
        }
      }];
    }
    else
    {
      NSLog(@"Error registering for notifications: Device Token is Nill");
    }
  }
  else
  {
    NSLog(@"registerPushNotifications Data Nil!");
  }
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification: (NSDictionary *)userInfo {
  NSLog(@"%@", userInfo);
  [self MessageBox:@"Notification" message:[[userInfo objectForKey:@"aps"] valueForKey:@"alert"]];
}
-(void)MessageBox:(NSString *) title message:(NSString *)messageText
{
  UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:messageText preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
  [alert addAction:okAction];
  [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:alert animated:YES completion:nil];
}
@end
