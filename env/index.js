let dotenv = require('dotenv');
const path = require('path');

// Set default to "development"
const nodeEnv = process.env.ENV_FILE || 'development';
const result2 = dotenv.config({
    path: path.resolve(__dirname,`${nodeEnv}.env`),
});

if (result2.error) {
    throw result2.error;
}
