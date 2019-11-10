module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "\\.(js|ts)?$": "babel-jest"
  },
  testMatch: ["<rootDir>/src/**/*.(spec|test).(ts|js)?(x)"],
  moduleFileExtensions: ["js", "ts", "json"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|scss)$": "identity-obj-proxy"
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  collectCoverageFrom: ["**/*.{js,ts}", "!**/node_modules/**"]
};
