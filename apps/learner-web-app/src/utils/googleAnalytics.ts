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
  if(localStorage.getItem('userProgram'))
  {
    ReactGA.send({ hitType: "pageview", page: url , program: localStorage.getItem('userProgram')});
    return;

  }
  else
  ReactGA.send({ hitType: "pageview", page: url });
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
  
  // Use gtag directly to send event with custom parameters
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
