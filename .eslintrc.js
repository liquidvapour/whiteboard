// eslint-disable-next-line no-undef
module.exports = {
    "env": {
        "browser": true,
        "es2020": true,
        "mocha": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "ignorePatterns": [
        "dist/**/*.js*"
    ],
    "rules": {
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
};
