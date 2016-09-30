module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            'jsx': true
        },
    },
    env: {
        es6: true,
        browser: true,
        mocha: true
    },
    plugins: [
        "react"
    ],
    globals: {},
    rules: {
        'no-console': 0,
        'react/prop-types': 1
    }
};
