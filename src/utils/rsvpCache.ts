export interface CachedRSVPData {
  reportId: string;
  name: string;
  status: 'yes' | 'maybe' | 'no';
  guests: number;
  blessing?: string;
  updatedAt: number;
}

const CACHE_KEY = 'rsvp_cache_data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function loadCachedRSVP(): CachedRSVPData | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CachedRSVPData = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() - data.updatedAt > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to load cached RSVP data:', error);
    return null;
  }
}

export function saveCachedRSVP(data: CachedRSVPData): void {
  try {
    if (typeof window === 'undefined') return;
    
    const dataToSave = {
      ...data,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn('Failed to save cached RSVP data:', error);
  }
}

export function clearCachedRSVP(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear cached RSVP data:', error);
  }
}

export function getURLName(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('name');
  } catch (error) {
    console.warn('Failed to get URL name:', error);
    return null;
  }
}

export function getURLId(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  } catch (error) {
    console.warn('Failed to get URL ID:', error);
    return null;
  }
}
