import { toast } from "react-toastify";

const options = {
  position: "bottom-center",
  hideProgressBar: true,
  closeButton: false,
  autoClose: 2000,
};

// `styleOverrides` lets a single call tweak its own appearance (e.g. a bolder
// font) without changing every toast in the app. Background colour stays
// owned by the type below and is not overridable.
export const showToastMessage = (message, type = "success", styleOverrides = {}) => {
  const commonOptions = {
    ...options,
    style: {
      color: "#fff",
      // The icon SVG is filled with var(--toastify-icon-color-<type>), which
      // defaults to the theme colour and is unreadable on our coloured
      // backgrounds. Force it white to match the text.
      "--toastify-icon-color-error": "#fff",
      "--toastify-icon-color-success": "#fff",
      "--toastify-icon-color-info": "#fff",
      "--toastify-icon-color-warning": "#fff",
      ...styleOverrides,
    },
  };

  switch (type) {
    case "error":
      toast.error(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#FF0000",
        },
      });
      break;
    case "success":
      toast.success(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#019722",
        },
      });
      break;
    case "info":
      toast.info(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#017AFF",
        },
      });
      break;
    case "warning":
      toast.warning(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: "#FFA500",
        },
      });
      break;
    default:
      throw new Error(`Unknown toast type: ${type}`);
  }
};
