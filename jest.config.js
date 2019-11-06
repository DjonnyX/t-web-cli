module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "\\.(js|ts)?$": "babel-jest"
  },
  testMatch: ["<rootDir>/src/**/*.(spec|test).(ts|js)?(x)"],
  moduleFileExtensions: ["js", "ts", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  collectCoverageFrom: ["**/*.{js,ts}", "!**/node_modules/**"]
};
