module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text', 'text-summary']
}
