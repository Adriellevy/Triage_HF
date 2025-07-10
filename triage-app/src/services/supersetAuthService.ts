// services/supersetAuthService.ts

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface SupersetConfig {
    baseUrl: string;
    username: string;
    password: string;
  }
  
  export interface GuestTokenPayload {
    user: {
      username: string;
      first_name: string;
      last_name: string;
    };
    resources: Array<{
      type: string;
      id: string;
    }>;
    rls: any[];
    roles: string[];
  }
  
  class SupersetAuthService {
    private config: SupersetConfig;
  
    constructor(config: SupersetConfig) {
      this.config = config;
    }
  
    /**
     * Realiza login en Superset y obtiene tokens de acceso
     */
    async login(): Promise<LoginResponse> {
      const loginUrl = `${this.config.baseUrl}/api/v1/security/login`;
      
      const payload = {
        username: this.config.username,
        password: this.config.password,
        provider: 'db',
        refresh: true
      };
  
      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
  
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }
  
    /**
     * Obtiene el token CSRF necesario para ciertas operaciones
     */
    async getCsrfToken(accessToken: string): Promise<string> {
      const csrfUrl = `${this.config.baseUrl}/api/v1/security/csrf_token/`;
  
      try {
        const response = await fetch(csrfUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.error('CSRF token error:', error);
        throw error;
      }
    }
  
    /**
     * Crea un token de invitado para embeber dashboards
     */
    async createGuestToken(dashboardId: string, customPayload?: Partial<GuestTokenPayload>): Promise<string> {
      try {
        // Validar dashboard ID
        if (!dashboardId) {
          throw new Error('Dashboard ID is required');
        }
  
        // Login y obtención del access token
        const loginData = await this.login();
        if (!loginData?.accessToken) {
          throw new Error('Failed to obtain access token');
        }
  
        const { accessToken } = loginData;
        console.log('Access Token obtenido:', accessToken);
  
        // Obtener CSRF token
        const csrfToken = await this.getCsrfToken(accessToken);
        if (!csrfToken) {
          throw new Error('Failed to obtain CSRF token');
        }
  
        console.log('CSRF Token obtenido:', csrfToken);
  
        // Preparar el payload por defecto
        const defaultPayload: GuestTokenPayload = {
          user: {
            username: 'admin',
            first_name: 'Superset',
            last_name: 'Admin'
          },
          resources: [{
            type: "dashboard",
            id: dashboardId
          }],
          rls: [],
          roles: ['Gamma']
        };
  
        // Combinar con payload personalizado si se proporciona
        const payload = { ...defaultPayload, ...customPayload };
        
        // Asegurar que el dashboard ID esté en los recursos
        if (payload.resources) {
          payload.resources = payload.resources.map(resource => 
            resource.type === 'dashboard' ? { ...resource, id: dashboardId } : resource
          );
        }
  
        console.log('Payload para guest token:', payload);
  
        // Definir la URL para la solicitud del guest token
        const guestTokenUrl = `${this.config.baseUrl}/api/v1/security/guest_token/`;
  
        // Realizar la solicitud
        const response = await fetch(guestTokenUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            Referer: guestTokenUrl
          },
          body: JSON.stringify(payload)
        });
  
        // Validar la respuesta
        if (!response.ok) {
          const errorBody = await response.json();
          console.error('Guest token error:', errorBody);
          throw new Error(`Failed to create guest token: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Guest token obtenido:', data.token);
        return data.token;
      } catch (error) {
        console.error('Create guest token error:', error);
        throw error;
      }
    }
  
    /**
     * Actualiza la configuración del servicio
     */
    updateConfig(newConfig: Partial<SupersetConfig>): void {
      this.config = { ...this.config, ...newConfig };
    }
  }
  
  export default SupersetAuthService;