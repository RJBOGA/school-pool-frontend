// src/utils/mapDebugUtils.ts

/**
 * Utility to check if Leaflet resources are properly loaded
 */
export const checkLeafletResources = () => {
    try {
      // Check if Leaflet CSS is loaded
      const leafletCssLoaded = document.querySelector(
        'link[href*="leaflet.css"]'
      );
      
      // Check if Leaflet marker images are accessible
      const testImage = new Image();
      testImage.src = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
      
      const resourceStatus = {
        cssLoaded: !!leafletCssLoaded,
        // Other checks can be added here
      };
      
      console.log('Leaflet resources status:', resourceStatus);
      return resourceStatus;
    } catch (error) {
      console.error('Error checking Leaflet resources:', error);
      return { error };
    }
  };
  
  /**
   * Attempts to fix common Leaflet issues
   */
  export const fixCommonLeafletIssues = () => {
    // Dynamically add Leaflet CSS if missing
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
      console.log('Added Leaflet CSS dynamically');
    }
  };
  
  /**
   * Debug tile loading issues
   */
  export const logTileLoadingStatus = (map: L.Map) => {
    const tileEvents = ['tileloadstart', 'tileload', 'tileerror'];
    
    tileEvents.forEach(eventType => {
      map.on(eventType, (e: any) => {
        console.log(`Tile ${eventType}:`, e);
      });
    });
    
    map.on('error', (e: any) => {
      console.error('Map error:', e);
    });
  };
  