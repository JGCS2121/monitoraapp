const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Firebase 9/10 requires .cjs extension to resolve properly in React Native
config.resolver.sourceExts.push('cjs');

module.exports = config;
