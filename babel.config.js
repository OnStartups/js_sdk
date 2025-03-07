module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '14',
            browsers: '> 0.25%, not dead'
          }
        }
      ]
    ]
};