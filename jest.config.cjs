module.exports = {
    testEnvironment: "jest-environment-jsdom",
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
      // map CSS modules / style imports to identity-obj-proxy so imports work in tests
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      // stub static assets
      "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
    },
    transformIgnorePatterns: [
      "/node_modules/"
    ],
    testMatch: ["**/tests/**/*.(test|spec).(js|jsx)"],
    verbose: true
  };