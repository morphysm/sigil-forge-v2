import { TextEncoder } from 'util';

// The Jest DOM environment leaves out the browser's UTF-8 encoder.
global.TextEncoder = TextEncoder;
