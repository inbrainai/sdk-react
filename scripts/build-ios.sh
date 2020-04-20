#!/bin/sh

RELATIVEPATH=$(dirname "$0")
source $RELATIVEPATH/common.sh

cd $BASEDIR/APP

# Add FRAMEWORK_SEARCH_PATHS
sed -i '' "s/GCC_C_LANGUAGE_STANDARD/FRAMEWORK_SEARCH_PATHS=\"\$(SRCROOT)\/\.\.\/node_modules\/$PKGNAME\/**\";GCC_C_LANGUAGE_STANDARD/g" ios/APP.xcodeproj/project.pbxproj 

# Add Inbrain properties in Info.plist
/usr/libexec/PlistBuddy -c "Add :InBrain dict" ios/APP/Info.plist
/usr/libexec/PlistBuddy -c "Add :InBrain:client string $CLIENT_ID" ios/APP/Info.plist
/usr/libexec/PlistBuddy -c "Add :InBrain:server bool false" ios/APP/Info.plist
/usr/libexec/PlistBuddy -c "Add :InBrain:prodEnv bool false" ios/APP/Info.plist

#$RNCLI_DIR/react-native run-ios

cd ios && pod install

