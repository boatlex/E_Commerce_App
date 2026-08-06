const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);


const nativeWindConfig = withNativeWind(config, { input: './global.css' });


module.exports = nativeWindConfig;
