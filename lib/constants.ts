/**
 * Application-wide constants
 */

// Cookie expiration: 7 days in seconds
export const COOKIE_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;

// File upload limits
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_MB = 10;

// Review limits
export const MAX_REVIEW_DESCRIPTION_LENGTH = 500;

// Custom build / lead form
export const MAX_BUILD_NOTES_LENGTH = 3000;

// Polling intervals (in milliseconds)
export const ADMIN_STATUS_POLL_INTERVAL = 2000; // 2 seconds

// UI delays (in milliseconds)
export const MODAL_AUTO_CLOSE_DELAY = 2500; // 2.5 seconds

// Build flow: show step 1 success, then open designer
export const BUILD_SUCCESS_TO_BUILDER_DELAY_MS = 3000;

