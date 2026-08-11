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

export const handleExitEvent = (options?: { preferPreviousPage?: boolean }) => {
  // Prefer exitLink/activeLink from the iframe URL — set by the parent player page.
  // This avoids using sessionStorage['previousPage'] which may point to a different domain.
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    // Android app + abandoned flow: this player runs in a cross-origin iframe, so it
    // cannot reach the native bridge (window.ReactNativeWebView) itself. Relay to the
    // parent (learner app) which hands control back to the native view via
    // ENROLL_PROGRAM_EVENT, instead of navigating the WebView to a web page.
    // (isAndroidApp is forwarded into this iframe's URL by the learner player page.)
    if (options?.preferPreviousPage && params.get('isAndroidApp') === 'yes') {
      window.parent?.postMessage({ type: 'player:exit-native' }, '*');
      return;
    }
    // Abandoned flow (e.g. exiting an assessment before completing): return to
    // previousPage (where the learner launched from) instead of the
    // post-completion gate (exitLink, e.g. /reattempt-check).
    if (options?.preferPreviousPage) {
      const previousUrl = params.get('previousPage');
      if (previousUrl) {
        const target = window.top ?? window;
        target.location.href = previousUrl;
        return;
      }
    }
    const exitUrl = params.get('exitLink') || params.get('activeLink');
    if (exitUrl) {
      const target = window.top ?? window;
      target.location.href = exitUrl;
      return;
    }
  }

  const previousPage = sessionStorage.getItem('previousPage');
  if (previousPage) {
    window.location.href = previousPage;
  } else {
    window.history.go(-1);
  }
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
