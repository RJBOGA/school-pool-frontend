// src/utils/leafletLoader.ts

/**
 * Ensures Leaflet resources are loaded properly
 */
export const ensureLeafletLoaded = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if Leaflet CSS is already loaded
      if (document.querySelector('link[href*="leaflet.css"]')) {
        console.log('Leaflet CSS already loaded');
        return resolve();
      }
  
      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      
      // Handle load and error events
      cssLink.onload = () => {
        console.log('Leaflet CSS loaded successfully');
        resolve();
      };
      
      cssLink.onerror = () => {
        console.error('Failed to load Leaflet CSS');
        reject(new Error('Failed to load Leaflet CSS'));
      };
      
      document.head.appendChild(cssLink);
    });
  };
  
  /**
   * Pre-loads marker icons to ensure they're available when needed
   */
  export const preloadMarkerIcons = (): Promise<void> => {
    const iconUrls = [
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    ];
    
    return Promise.all(
      iconUrls.map(url => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn(`Failed to preload marker icon: ${url}`);
            resolve(); // Still resolve so we don't block other operations
          };
          img.src = url;
        });
      })
    ).then(() => {
      console.log('Marker icons preloaded');
      return Promise.resolve();
    });
  };
  
  /**
   * Initialize Leaflet resources before using the map
   */
  export const initializeLeaflet = async (): Promise<void> => {
    try {
      await ensureLeafletLoaded();
      await preloadMarkerIcons();
      console.log('Leaflet resources initialized successfully');
    } catch (error) {
      console.error('Error initializing Leaflet resources:', error);
      // Still allow the app to continue
    }
  };
  
  // Helper function to create a local copy of marker icons
  export const createLocalMarkerIcons = () => {
    // This fallback can be used if CDN icons fail to load
    return {
      iconUrl: '/marker-icon.png', // These would need to be stored in your public folder
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    };
  };
  