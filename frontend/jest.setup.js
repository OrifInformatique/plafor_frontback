import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// jsdom does not provide TextEncoder/TextDecoder, but React Router v7 needs
// them as soon as it is imported: expose Node's implementation.
Object.assign(global, { TextDecoder, TextEncoder });
