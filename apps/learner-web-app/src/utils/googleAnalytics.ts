import ReactGA from "react-ga4";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

export const logPageView = (url: string) => {
  // Extract doid from current route if present
  const currentPath = window.location.pathname;
  const doidMatches = Array.from(currentPath.matchAll(/do_\d+/g));
  
  const additionalParams: Record<string, string> = {};
  if (doidMatches.length === 3) {
    // If there are exactly 3 do_ IDs: first=content_id, second=course_id, third=unit_id
    additionalParams.content_id =  doidMatches[2][0];
    additionalParams.course_id = doidMatches[0][0];
    additionalParams.unit_id = doidMatches[1][0]
  } 
  else if (doidMatches.length === 2) {
    additionalParams.course_id = doidMatches[0][0];
    additionalParams.unit_id = doidMatches[1][0];
  }
  else if (doidMatches.length > 0) {
    // If there are other numbers of do_ IDs, use the last one as content_id
    additionalParams.content_id = doidMatches[doidMatches.length - 1][0];
  }
  
  const userProgram = localStorage.getItem('userProgram');
  if(userProgram)
  {
    const pageViewData: Record<string, string> = { hitType: "pageview", page: url, program: userProgram, ...additionalParams };
    ReactGA.send(pageViewData);
    return;
  }
  else {
    const pageViewData: Record<string, string> = { hitType: "pageview", page: url, ...additionalParams };
    ReactGA.send(pageViewData);
  }
};

export const logEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window === "undefined") return;
  
  const userProgram = localStorage.getItem('userProgram');
  
  // Build event parameters for GA4
  const eventParams: Record<string, string | number> = {
    event_category: category,
  };
  
  // Add optional fields
  if (label) {
    eventParams.event_label = label;
  }
  if (value !== undefined) {
    eventParams.value = value;
  }
  
  // Add program name if available (custom parameter)
  if (userProgram) {
    console.log('userProgram', userProgram);
    eventParams.program = userProgram;
  }
  
  // Extract doid from current route if present
  const currentPath = window.location.pathname;
  const doidMatches = Array.from(currentPath.matchAll(/do_\d+/g));
  
  if (doidMatches.length === 3) {
    // If there are exactly 3 do_ IDs: first=content_id, second=course_id, third=unit_id
    eventParams.content_id = doidMatches[2][0];
    eventParams.course_id = doidMatches[0][0];
    eventParams.unit_id =  doidMatches[1][0];
  } 
  else if (doidMatches.length === 2) {
    eventParams.course_id = doidMatches[0][0];
    eventParams.unit_id = doidMatches[1][0];
  }
  else if (doidMatches.length > 0) {
    // If there are other numbers of do_ IDs, use the last one as content_id
    eventParams.content_id = doidMatches[doidMatches.length - 1][0];
  }
 
  // // Use gtag directly to send event with custom parameters
  // This ensures custom parameters like 'program' are sent to GA4
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('event', action, eventParams);
  } else {
    // Fallback to ReactGA.event if gtag is not available
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
  }
};
