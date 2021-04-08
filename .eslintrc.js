module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es2021": true
    },
 
    "extends": "eslint:recommended",
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 12,
        "sourceType": "module",
        "parser": "@typescript-eslint/parser"


    },
    "rules": {
        "no-unused-vars": 0
    }
    
};
