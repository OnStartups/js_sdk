module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/**/*.test.js',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
};