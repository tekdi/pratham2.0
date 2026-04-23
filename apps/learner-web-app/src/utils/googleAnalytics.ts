import ReactGA from "react-ga4";
import { fetchContent } from "./API/contentService";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

export const logPageView = async (url: string) => {
  // Extract doid from current route if present
  const currentPath = window.location.pathname;
  const doidMatches = Array.from(currentPath.matchAll(/do_\d+/g));
  
  const additionalParams: Record<string, string> = {
    origin: window.location.pathname.includes('/pos') ? 'pos web' : 'learner plp web app',
  };
  let contentId: string | undefined;

  let courseId: string | undefined;
  let unitId: string | undefined;

  if (doidMatches.length === 3) {
    // If there are exactly 3 do_ IDs: first=content_id, second=course_id, third=unit_id
    contentId = doidMatches[2][0];
    courseId = doidMatches[0][0];
    unitId = doidMatches[1][0];
    additionalParams.content_id = contentId;
    additionalParams.course_id = courseId;
    additionalParams.unit_id = unitId;
  }
  else if (doidMatches.length === 2) {
    courseId = doidMatches[0][0];
    unitId = doidMatches[1][0];
    additionalParams.course_id = courseId;
    additionalParams.unit_id = unitId;
  }
  else if (doidMatches.length > 0) {
    contentId = doidMatches[doidMatches.length - 1][0];
    additionalParams.content_id = contentId;
  }

  // Fetch content, course, and unit details in parallel when IDs are available
  await Promise.all([
    contentId
      ? fetchContent(contentId)
          .then((data) => {
            console.log('Fetched content details for GA page view:', data);
            if (data?.name) additionalParams.content_name = data.name;
            if (data?.mimeType) additionalParams.content_type = data.mimeType;
            if (data?.contentLanguage) additionalParams.content_language = data.contentLanguage;
          })
          .catch((err) => console.error('Error fetching content details for GA page view:', err))
      : Promise.resolve(),
    courseId
      ? fetchContent(courseId)
          .then((data) => {
            if (data?.name) additionalParams.course_name = data.name;
          })
          .catch((err) => console.error('Error fetching course details for GA page view:', err))
      : Promise.resolve(),
    // unitId
    //   ? fetchContent(unitId)
    //       .then((data) => {
    //         if (data?.name) additionalParams.unit_name = data.name;
    //       })
    //       .catch((err) => console.error('Error fetching unit details for GA page view:', err))
    //   : Promise.resolve(),
  ]);
  
  const userProgram = localStorage.getItem('userProgram');
  if (userProgram) {
    const pageViewData: Record<string, string> = { hitType: "pageview", page: url, program: userProgram, ...additionalParams };
    ReactGA.send(pageViewData);
    return;
  } else {
    const pageViewData: Record<string, string> = { hitType: "pageview", page: url, ...additionalParams };
    ReactGA.send(pageViewData);
  }
};

export const logEvent = async ({
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
  
  let contentId: string | undefined;
  let courseId: string | undefined;
  let unitId: string | undefined;

  if (doidMatches.length === 3) {
    // If there are exactly 3 do_ IDs: first=content_id, second=course_id, third=unit_id
    contentId = doidMatches[2][0];
    courseId = doidMatches[0][0];
    unitId = doidMatches[1][0];
    eventParams.content_id = contentId;
    eventParams.course_id = courseId;
    eventParams.unit_id = unitId;
  }
  else if (doidMatches.length === 2) {
    courseId = doidMatches[0][0];
    unitId = doidMatches[1][0];
    eventParams.course_id = courseId;
    eventParams.unit_id = unitId;
  }
  else if (doidMatches.length > 0) {
    contentId = doidMatches[doidMatches.length - 1][0];
    eventParams.content_id = contentId;
  }

  // Fetch content, course, and unit details in parallel when IDs are available
  await Promise.all([
    contentId
      ? fetchContent(contentId)
          .then((data) => {
            if (data?.name) eventParams.content_name = data.name;
            if (data?.mimeType) eventParams.content_type = data.mimeType;
            if (data?.contentLanguage) eventParams.content_language = data.contentLanguage;
          })
          .catch((err) => console.error('Error fetching content details for GA event:', err))
      : Promise.resolve(),
    courseId
      ? fetchContent(courseId)
          .then((data) => {
            if (data?.name) eventParams.course_name = data.name;
          })
          .catch((err) => console.error('Error fetching course details for GA event:', err))
      : Promise.resolve(),
    // unitId
    //   ? fetchContent(unitId)
    //       .then((data) => {
    //         if (data?.name) eventParams.unit_name = data.name;
    //       })
    //       .catch((err) => console.error('Error fetching unit details for GA event:', err))
    //   : Promise.resolve(),
  ]);

  console.log('[GA logEvent] eventParams:', eventParams);

  // Use gtag directly to send event with custom parameters
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('event', action, eventParams);
  } else {
    // Fallback: use ReactGA send so eventParams (including origin) are included
    ReactGA.send({ hitType: 'event', event_action: action, ...eventParams });
  }
};
