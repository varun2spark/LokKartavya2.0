// Detect Vite environment variable automatically when deployed (or default to port 5000)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
