// jest.config.js

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: [
		'<rootDir>/apps',   // Set the root directory for your apps folder
		'<rootDir>/packages', // Include the packages folder for tests
	],
	moduleNameMapper: {
		'@auth/(.*)': '<rootDir>/packages/auth/src/$1',
		'@services/(.*)': '<rootDir>/packages/services/src/$1',
		'@iam/types': '<rootDir>/packages/types/src/$1',
		// Add more mappings as needed for your custom modules
	},
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files using ts-jest
	},
	testMatch: [
		'**/tests/**/*.test.ts',  // Look for test files in the tests folder
		'**/__tests__/**/*.ts',    // Look for __tests__ directories
	],
	collectCoverageFrom: [
		'apps/backend/src/**/*.{ts,tsx}', // Collect coverage from backend source files
		'packages/auth/src/**/*.{ts,tsx}', // Collect coverage from auth source files
		'packages/services/src/**/*.{ts,tsx}', // Collect coverage from services source files
	],
	coverageDirectory: '<rootDir>/coverage', // Specify where to save coverage reports
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
}  