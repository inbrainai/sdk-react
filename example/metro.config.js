// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://facebook.github.io/metro/docs/configuration
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blacklistRE: exclusionList(
      modules.map(
        m => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`),
      ),
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      // acc['inbrain-surveys'] = {root: path.resolve(__dirname, '..')};
      acc['inbrain-surveys'] = path.resolve(__dirname, '../');
      return acc;
    }, {}),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

    // extraNodeModules: {
    //   // Указываем, где искать вашу библиотеку
    //   'inbrain-surveys': path.resolve(__dirname, '../'), // Путь к корневой директории вашей библиотеки
    //   // Указываем, что react и react-native должны браться из вашей библиотеки
    //   // 'react': path.resolve(__dirname, '../node_modules/react'),
    //   // 'react-native': path.resolve(__dirname, '../node_modules/react-native'),
    //   // Добавьте другие модули, если они также используются
    //   // '@': path.resolve(__dirname, '../node_modules'),
    //   // '@react-navigation/native-stack': path.resolve(__dirname, './node_modules/@react-navigation/native-stack'),
    //   // '@react-navigation/native': path.resolve(__dirname, './node_modules/@react-navigation/native'),
    //   // '@react-navigation/core': path.resolve(__dirname, './node_modules/@react-navigation/core'),
    // },