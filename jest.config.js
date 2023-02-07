module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config', './src/testing/setup.js'],
    modulePathIgnorePatterns: ['./build']
};