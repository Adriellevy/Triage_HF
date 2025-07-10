import { SupersetConfig } from '../services/supersetAuthService';

interface EnvConfig {
  SUPERSET_DOMAIN: string
  API_URL: string
  NETWORK_APP_URL: string
  PYTHON_URL: string
}

const defaultConfig: EnvConfig = {
  API_URL: 'http://localhost:3000',
  NETWORK_APP_URL: 'http://localhost:5173',
  PYTHON_URL: 'http://localhost:5000',
}

export const config: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : defaultConfig.API_URL,
  NETWORK_APP_URL: import.meta.env.VITE_NETWORK_APP_URL
    ? import.meta.env.VITE_NETWORK_APP_URL
    : defaultConfig.NETWORK_APP_URL,
  PYTHON_URL: import.meta.env.VITE_PYTHON_URL
    ? import.meta.env.VITE_PYTHON_URL
    : defaultConfig.PYTHON_URL,
  SUPERSET_DOMAIN: import.meta.env.SUPERSET_DOMAIN
    ? import.meta.env.SUPERSET_DOMAIN
    : defaultConfig.SUPERSET_DOMAIN
}


// Configuración por defecto para desarrollo
export const defaultSupersetConfig: SupersetConfig = {
  baseUrl: 'http://127.0.0.1:8088',
  username: 'admin',
  password: 'admin'
};

// Configuración para producción (usar variables de entorno)
// export const productionSupersetConfig: SupersetConfig = {
//   baseUrl: process.env.REACT_APP_SUPERSET_URL || 'http://127.0.0.1:8088',
//   username: process.env.REACT_APP_SUPERSET_USERNAME || 'admin',
//   password: process.env.REACT_APP_SUPERSET_PASSWORD || 'admin'
// };

// Función para obtener la configuración según el entorno
export const getSupersetConfig = (): SupersetConfig => {
  // const isProduction = process.env.NODE_ENV === 'production';
  // return isProduction ? productionSupersetConfig : defaultSupersetConfig;
  return defaultSupersetConfig
};

// IDs de dashboards comunes (para reutilización)
export const DASHBOARD_IDS = {
  MAIN_DASHBOARD: '24e4d855-7e21-4590-b0a9-41e857fd3c5b',
  ANALYTICS_DASHBOARD: '4aa22d8e-96e4-4513-baf5-bc9b6af1c4cc'
  // Agregar más IDs según sea necesario
};