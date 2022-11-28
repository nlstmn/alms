/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <WindowsAzureMessaging/WindowsAzureMessaging.h>
#import <UserNotifications/UserNotifications.h>
#import "HubInfo.h"
#import <React/RCTBridgeModule.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, RCTBridgeModule>{
  
  NSString *userId;
  NSString *organizationId;
  
}

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) NSString *userId;
@property (nonatomic, strong) NSString *organizationId;
@end
