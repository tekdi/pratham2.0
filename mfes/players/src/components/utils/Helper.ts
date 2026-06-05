export const timeAgo = (dateString: string) => {
  const now: any = new Date();
  const date: any = new Date(dateString);
  const secondsAgo = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout);
    if (immediate && !timeout) func.apply(context, args);
    timeout = setTimeout(() => {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
};

// On Exit, redirect the top window to activeLink/exitLink instead of history.back() (fixes new-tab player flow).
export const handleExitEvent = () => {
  const exitUrl = getPlayerExitUrl();
  if (exitUrl) {
    const targetWindow = window.top ?? window;
    targetWindow.location.href = exitUrl;
    return;
  }

  const targetWindow = window.top ?? window;
  targetWindow.history.go(-1);
};

/** Read exitLink / activeLink / previousPage from iframe or parent URL for post-exit redirect. */
export const getPlayerExitUrl = (): string | null => {
  if (typeof window === 'undefined') return null;

  const readParams = (search: string) => {
    const params = new URLSearchParams(search);
    return (
      params.get('exitLink') ||
      params.get('activeLink') ||
      params.get('previousPage')
    );
  };

  const fromCurrent = readParams(window.location.search);
  if (fromCurrent) return fromCurrent;

  const fromSession = sessionStorage.getItem('previousPage');
  if (fromSession) return fromSession;

  try {
    if (window.parent && window.parent !== window) {
      const fromParent = readParams(window.parent.location.search);
      if (fromParent) return fromParent;
    }
  } catch {
    // Cross-origin iframe — parent search is not readable; rely on iframe query params.
  }

  return null;
};

export const getOptionsByCategory = (frameworks: any, categoryCode: string) => {
  // Find the category by code
  const category = frameworks.categories.find(
    (category: any) => category.code === categoryCode
  );

  // Return the mapped terms
  return category.terms.filter((term: any) => term.status !== "Retired").map((term: any) => ({
    name: term.name,
    code: term.code,
    associations: term.associations,
  }));
};
export const getTelemetryEvents = (eventData: any, contentType: string) => {
  console.log('getTelemetryEvents hit');

  if (!eventData?.object?.id) {
    console.error('Invalid event data');
    return;
  }

  const {
    eid,
    edata,
    object: { id: identifier },
  } = eventData;
  const telemetryKey = `${contentType}_${identifier}_${eid}`;

  const telemetryData = {
    eid,
    edata,
    identifier,
    contentType,
  };

  console.log(`${eid}Telemetry`, telemetryData);

  localStorage.setItem(telemetryKey, JSON.stringify(telemetryData));
};
