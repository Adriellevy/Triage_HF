// services/supersetEmbedService.ts

import { embedDashboard } from "@superset-ui/embedded-sdk";
import SupersetAuthService from './supersetAuthService';

export interface EmbedConfig {
  dashboardId: string;
  supersetDomain: string;
  mountPointId: string;
  dashboardUiConfig?: {
    hideTitle?: boolean;
    filters?: {
      expanded?: boolean;
    };
    hideTab?: boolean;
    hideChartControls?: boolean;
  };
  iframeSandboxExtras?: string[];
}

export interface EmbedResult {
  success: boolean;
  error?: string;
  token?: string;
}

class SupersetEmbedService {
  private authService: SupersetAuthService;

  constructor(authService: SupersetAuthService) {
    this.authService = authService;
  }

  /**
   * Embebe un dashboard de Superset en el DOM
   */
  async embedDashboard(config: EmbedConfig): Promise<EmbedResult> {
    try {
      // Validar configuración
      if (!config.dashboardId) {
        throw new Error('Dashboard ID is required');
      }

      if (!config.supersetDomain) {
        throw new Error('Superset domain is required');
      }

      if (!config.mountPointId) {
        throw new Error('Mount point ID is required');
      }

      // Verificar que el punto de montaje existe
      const mountPoint = document.getElementById(config.mountPointId);
      if (!mountPoint) {
        throw new Error(`Mount point with ID "${config.mountPointId}" not found`);
      }

      // Crear token de invitado
      const guestToken = await this.authService.createGuestToken(config.dashboardId);

      // Función para obtener el token que será usada por embedDashboard
      const fetchGuestToken = async (): Promise<string> => {
        if (!guestToken) {
          throw new Error('Guest token not available');
        }
        return guestToken;
      };

      // Configuración por defecto del dashboard
      const defaultDashboardUiConfig = {
        hideTitle: true,
        filters: {
          expanded: false,
        }
      };

      // Configuración por defecto del iframe
      const defaultIframeSandboxExtras = ['allow-top-navigation', 'allow-popups-to-escape-sandbox'];

      // Embeber el dashboard
      await embedDashboard({
        id: config.dashboardId,
        supersetDomain: config.supersetDomain,
        mountPoint: mountPoint,
        fetchGuestToken: fetchGuestToken,
        dashboardUiConfig: {
          ...defaultDashboardUiConfig,
          ...config.dashboardUiConfig
        },
        iframeSandboxExtras: config.iframeSandboxExtras || defaultIframeSandboxExtras
      });

      return {
        success: true,
        token: guestToken
      };
    } catch (error) {
      console.error('Error embedding dashboard:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Aplica estilos personalizados al iframe del dashboard
   */
  applyIframeStyles(
    mountPointId: string, 
    styles: { width?: string; height?: string; [key: string]: any }
  ): boolean {
    try {
      const container = document.getElementById(mountPointId);
      
      if (!container) {
        console.error(`Container with ID "${mountPointId}" not found`);
        return false;
      }

      const iframe = container.querySelector('iframe');
      if (!iframe) {
        console.error('Iframe not found in container');
        return false;
      }

      // Aplicar estilos
      Object.entries(styles).forEach(([property, value]) => {
        if (value !== undefined) {
          (iframe.style as any)[property] = value;
        }
      });

      return true;
    } catch (error) {
      console.error('Error applying iframe styles:', error);
      return false;
    }
  }

  /**
   * Remueve un dashboard embebido
   */
  removeDashboard(mountPointId: string): boolean {
    try {
      const container = document.getElementById(mountPointId);
      
      if (!container) {
        console.error(`Container with ID "${mountPointId}" not found`);
        return false;
      }

      // Limpiar el contenido del contenedor
      container.innerHTML = '';
      return true;
    } catch (error) {
      console.error('Error removing dashboard:', error);
      return false;
    }
  }

  /**
   * Verifica si un dashboard está embebido
   */
  isDashboardEmbedded(mountPointId: string): boolean {
    try {
      const container = document.getElementById(mountPointId);
      return !!(container && container.querySelector('iframe'));
    } catch (error) {
      console.error('Error checking dashboard status:', error);
      return false;
    }
  }
}

export default SupersetEmbedService;