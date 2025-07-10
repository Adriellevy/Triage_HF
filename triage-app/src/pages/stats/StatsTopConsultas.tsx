import { useState, useEffect, useCallback, useRef } from 'react';
import SupersetAuthService from '../../services/supersetAuthService';
import SupersetEmbedService from '../../services/supersetEmbedService';
import { getSupersetConfig, DASHBOARD_IDS } from '../../config/env';


interface DashboardProps {
  dashboardId?: string;
  width?: string;
  height?: string;
  hideTitle?: boolean;
  hideFilters?: boolean;
}


function Dashboard({ 
  dashboardId = DASHBOARD_IDS.MAIN_DASHBOARD,
  width = '1000px',
  height = '1000px',
  hideTitle = true,
  hideFilters = false
}: DashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [embedResult, setEmbedResult] = useState<any>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);

  // Generar ID único solo una vez
  const containerId = useRef(`superset-dashboard-${Math.random().toString(36).substr(2, 9)}`).current;

  // Callback ref que se ejecuta cuando el elemento está disponible
  const containerRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      element.id = containerId;
      setContainerElement(element);
    }
  }, [containerId]);

  // Obtener guest token solo una vez por dashboardId
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setGuestToken(null);
    setEmbedResult(null);
    const config = getSupersetConfig();
    const authService = new SupersetAuthService(config);
    authService.createGuestToken(dashboardId)
      .then(token => {
        if (isMounted) setGuestToken(token);
      })
      .catch(err => {
        if (isMounted) setError(err.message || 'Error getting guest token');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, [dashboardId]);

  // Embebe el dashboard solo cuando guestToken y containerElement están listos
  useEffect(() => {
    if (!guestToken || !containerElement) return;
    setIsLoading(true);
    setError(null);
    const config = getSupersetConfig();
    const authService = new SupersetAuthService(config);
    const embedService = new SupersetEmbedService(authService);
    embedService.embedDashboard({
      dashboardId: dashboardId,
      supersetDomain: config.baseUrl,
      mountPointId: containerId,
      dashboardUiConfig: {
        hideTitle: hideTitle,
        filters: {
          expanded: !hideFilters
        }
      }
    })
      .then(result => {
        if (!result.success) {
          throw new Error(result.error || 'Failed to embed dashboard');
        }
        setEmbedResult(result);
        setTimeout(() => {
          embedService.applyIframeStyles(containerId, {
            width: width,
            height: height
          });
        }, 1000);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [guestToken, containerElement, dashboardId, width, height, hideTitle, hideFilters, containerId]);

  const handleRetry = () => {
    setError(null);
    setEmbedResult(null);
    setGuestToken(null);
    setIsLoading(true);
    // Forzar re-inicialización
    if (containerElement) {
      containerElement.innerHTML = '';
    }
    // Volver a obtener el token
    const config = getSupersetConfig();
    const authService = new SupersetAuthService(config);
    authService.createGuestToken(dashboardId)
      .then(token => setGuestToken(token))
      .catch(err => setError(err.message || 'Error getting guest token'))
      .finally(() => setIsLoading(false));
  };

  return <div
  ref={containerRef}
  style={{
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    minHeight: '400px',
    backgroundColor: '#f8f9fa'
  }}
></div>;
}

export default Dashboard;