let apiBaseUrl: string | null = null;

// The URL to the text file containing the API base URL.
const CONFIG_URL = "https://raw.githubusercontent.com/iranflix/link/refs/heads/main/cloud-server-iran.txt";

/**
 * Fetches and initializes the API base URL from a remote source.
 * This should be called once when the application starts.
 * @returns {Promise<string>} The fetched base URL.
 */
export const initializeApiConfig = async (): Promise<string> => {
  if (apiBaseUrl) {
    return apiBaseUrl;
  }

  try {
    // We use a proxy to avoid potential CORS issues.
    const proxyUrl = 'https://corsproxy.io/?';
    const response = await fetch(`${proxyUrl}${CONFIG_URL}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch API config: ${response.status} ${response.statusText}`);
    }
    const url = await response.text();
    let finalUrl = url.trim();
    if (!finalUrl) {
        throw new Error('Fetched API base URL is empty.');
    }
    
    // Remove trailing slash if it exists.
    if (finalUrl.endsWith('/')) {
        finalUrl = finalUrl.slice(0, -1);
    }

    apiBaseUrl = finalUrl; 
    return apiBaseUrl;
  } catch (error) {
    console.error("Could not initialize API config:", error);
    throw error;
  }
};

/**
 * Gets the previously initialized API base URL.
 * Throws an error if the configuration has not been initialized yet.
 * @returns {string} The API base URL.
 */
export const getApiBaseUrl = (): string => {
    if (!apiBaseUrl) {
        throw new Error("API config has not been initialized. Call initializeApiConfig first.");
    }
    return apiBaseUrl;
}
