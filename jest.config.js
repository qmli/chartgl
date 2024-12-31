tsconfig = require('./tsconfig.json').compilerOptions;
tsconfig.types.push('jest')

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig }],
    },
};
