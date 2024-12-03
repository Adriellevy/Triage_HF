interface EnvConfig {
  API_URL: string;
  NETWORK_APP_URL: string;
  PYTHON_URL: string;
}

const defaultConfig: EnvConfig = {
  API_URL: 'http://localhost:3000',
  NETWORK_APP_URL: 'http://localhost:5173',
  PYTHON_URL: 'http://localhost:5000'
};

export const config: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : defaultConfig.API_URL,
  NETWORK_APP_URL: import.meta.env.VITE_NETWORK_APP_URL ? import.meta.env.VITE_NETWORK_APP_URL : defaultConfig.NETWORK_APP_URL,
  PYTHON_URL: import.meta.env.VITE_PYTHON_URL ? import.meta.env.VITE_PYTHON_URL : defaultConfig.PYTHON_URL
}; 