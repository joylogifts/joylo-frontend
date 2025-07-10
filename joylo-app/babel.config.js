// babel.config.js — at the project root
module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      'babel-preset-expo' // ← handles JSX, TS, and RN out of the box
    ],
    plugins: [
      // your path aliases
      [
        'module-resolver',
        {
          alias: { '@/src': './src' }
        }
      ],

      // if you use Reanimated, keep this last
      'react-native-reanimated/plugin'
    ],
    overrides: [
      {
        test: (fileName) => !fileName.includes('node_modules/react-native-maps'),
        plugins: [
          ['@babel/plugin-transform-class-properties', { loose: true }],
          ['@babel/plugin-transform-private-methods', { loose: true }],
          ['@babel/plugin-transform-private-property-in-object', { loose: true }],
        ],
      },
    ],
  }
}
