#!/bin/sh

RNVERSION=0.62.0

RELATIVEPATH=$(dirname "$0")
source $RELATIVEPATH/common.sh

# Install RN cli 0.59
cd cli && npm install && cd ..

# Init RN app
APPNAME=APP$RNVERSION
rm -rf APP
if test -f "$APPNAME.tar.gz"; then
    tar -xf $APPNAME.tar.gz
else
    npx react-native init APP --version=$RNVERSION
    tar -zcf APP$RNVERSION.tar.gz APP
fi

# Copy our code example
cp App.js APP/App.js && cd APP

# Install current working version
npm install inbrain-surveys@$VERSION --save

# Install react-native-dotenv
npm install react-native-dotenv --save-dev

echo "module.exports = { presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv']}" > $BASEDIR/APP/babel.config.js;
cp $BASEDIR/env.vars $BASEDIR/APP/.env




