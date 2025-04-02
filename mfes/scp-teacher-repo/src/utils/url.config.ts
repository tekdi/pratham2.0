const baseurl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;

export const URL_CONFIG = {
  PARAMS: {
    CONTENT_GET:
      'transcripts,ageGroup,appIcon,artifactUrl,attributions,attributions,audience,author,badgeAssertions,body,channel,code,concepts,contentCredits,contentType,contributors,copyright,copyrightYear,createdBy,createdOn,creator,creators,description,displayScore,domain,editorState,flagReasons,flaggedBy,flags,framework,identifier,itemSetPreviewUrl,keywords,language,languageCode,lastUpdatedOn,license,mediaType,mimeType,name,originData,osId,owner,pkgVersion,publisher,questions,resourceType,scoreDisplayConfig,status,streamingUrl,template,templateId,totalQuestions,totalScore,versionKey,visibility,year,primaryCategory,additionalCategories,interceptionPoints,interceptionType',
    LICENSE_DETAILS: 'name,description,url',
    HIERARCHY_FEILDS: 'instructions,outcomeDeclaration',
  },
  API: {
    CONTENT_READ: baseurl + '/api/content/v1/read/',
    HIERARCHY_API: baseurl + '/action/questionset/v2/hierarchy/',
    QUESTIONSET_READ: baseurl + '/action/questionset/v2/read/',
    COMPOSITE_SEARCH: baseurl + '/action/composite/v3/search',
    CONTENT_HIERARCHY: baseurl + '/action/content/v3/hierarchy',
  },
};
