// Add any global test setup here
import "@testing-library/jest-dom";

// Mock environment variables
process.env.NODE_ENV = "test";

// Add any global test teardown here
afterEach(() => {
  jest.clearAllMocks();
});
