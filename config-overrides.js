//const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(new MonacoWebpackPlugin({
        languages: ["html", "javascript", "typescript", "csharp", "python"]
    }));

    // config.plugins.push(
    //     (process.env.NODE_ENV === 'production') ?
    //     new CopyWebpackPlugin([{from: 'src/lib/legacyLib.js'}]) :
    //     new CopyWebpackPlugin([{from: 'src/lib/legacyLib.js', to: 'dist'}])
    // );

    return config;
}

 //"start": "react-scripts start",
//"build": "react-scripts build",