let apiBaseUrl: string | null = null;
let configInitializationPromise: Promise<string> | null = null;

// The URL to the text file containing the API base URL.
const CONFIG_URL =
  "https://raw.githubusercontent.com/iranflix/link/refs/heads/main/cloud-server-iran.txt";

// Alternative CORS proxies to try
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

/**
 * Fetches and initializes the API base URL from a remote source.
 * This should be called once when the application starts.
 * Caches the result and reuses the same promise if called multiple times.
 * @returns {Promise<string>} The fetched base URL.
 */
export const initializeApiConfig = async (retries = 3): Promise<string> => {
  // If already initialized, return cached value
  if (apiBaseUrl) {
    return apiBaseUrl;
  }

  // If initialization is in progress, return the existing promise
  if (configInitializationPromise) {
    return configInitializationPromise;
  }

  // Start new initialization and cache the promise
  configInitializationPromise = (async () => {
    let lastError: Error | null = null;

    // Try direct fetch first (works if CORS is enabled)
    try {
      const response = await fetch(CONFIG_URL);
      if (response.ok) {
        const url = await response.text();
        let finalUrl = url.trim();
        if (finalUrl) {
          if (finalUrl.endsWith("/")) {
            finalUrl = finalUrl.slice(0, -1);
          }
          apiBaseUrl = finalUrl;
          configInitializationPromise = null; // Clear promise after success
          return apiBaseUrl;
        }
      }
    } catch (error) {
      console.log("Direct fetch failed, trying proxies...");
    }

    // Try each proxy
    for (const proxyUrl of CORS_PROXIES) {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const response = await fetch(`${proxyUrl}${CONFIG_URL}`);
          if (response.ok) {
            const url = await response.text();
            let finalUrl = url.trim();
            if (!finalUrl) {
              continue; // Try next proxy
            }

            // Remove trailing slash if it exists.
            if (finalUrl.endsWith("/")) {
              finalUrl = finalUrl.slice(0, -1);
            }

            apiBaseUrl = finalUrl;
            configInitializationPromise = null; // Clear promise after success
            return apiBaseUrl;
          } else if (response.status === 403 && attempt < retries - 1) {
            // Wait a bit before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (attempt + 1))
            );
            continue;
          }
        } catch (error) {
          lastError = error as Error;
          if (attempt < retries - 1) {
            // Wait before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (attempt + 1))
            );
          }
        }
      }
    }

    // If all proxies fail, throw the last error
    const errorMessage = lastError
      ? `Failed to fetch API config: ${lastError.message}`
      : "Failed to fetch API config: All attempts failed";
    console.error("Could not initialize API config:", errorMessage);
    configInitializationPromise = null; // Clear promise after error
    throw new Error(errorMessage);
  })();

  return configInitializationPromise;
};

/**
 * Gets the previously initialized API base URL.
 * Throws an error if the configuration has not been initialized yet.
 * @returns {string} The API base URL.
 */
export const getApiBaseUrl = (): string => {
  if (!apiBaseUrl) {
    throw new Error(
      "API config has not been initialized. Call initializeApiConfig first."
    );
  }
  return apiBaseUrl;
};
