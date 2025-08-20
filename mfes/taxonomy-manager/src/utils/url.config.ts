export const URL_CONFIG = {
  API: {
    COMPOSITE_SEARCH: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/action/composite/v3/search`,
    CHANNEL_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/channel/v1/create`,
    FRAMEWORK_READ: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/read`,
    FRAMEWORK_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/create`,
    FRAMEWORK_PUBLISH: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/publish`,
    CATEGORY_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/category/create`,
    TERM_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/term/create`,
    TERM_UPDATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/term/update`,
    TERM_DELETE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/term/retire`,
    MASTER_CATEGORY_SEARCH: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/action/composite/v3/search`,
    MASTER_CATEGORY_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/category/master/create`,
    // Add more API endpoints here as needed
  },
};
