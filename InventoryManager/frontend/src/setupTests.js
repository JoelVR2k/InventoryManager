console.log('--- VITEST SETUP FILE IS RUNNING ---');

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { server } = require('./mocks/server');
require('@testing-library/jest-dom');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());