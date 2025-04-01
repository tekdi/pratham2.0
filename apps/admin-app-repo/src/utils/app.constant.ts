import { TFunction } from 'i18next';
import pdf from './../assets/images/PDF.svg';
import epub from '../assets/images/Epub.svg';
import html from '../assets/images/HTML.svg';
import mp4 from '../assets/images/MP4.svg';
import qml from '../assets/images/Qml.svg';
import youtube from '../assets/images/youtube.svg';

// background image

import bgpdf from './../assets/images/bgPDF.svg';
import bgepub from '../assets/images/bgEpub.svg';
import bghtml from '../assets/images/bgHtml.svg';
import bgmp4 from '../assets/images/bgMP4.svg';
import bgqml from '../assets/images/bgQml.svg';
import bgyoutube from '../assets/images/bgYouTube.svg';

export const limit: number = 200;
export const metaTags = {
  title: 'Pratham Admin Management App',
};

// export enum Role {
//   STUDENT = "Learner",
//   TEACHER = "Instructor",
//   TEAM_LEADER = "Team Leader",
//   TEAM_LEADERS = "Team Leaders",

//   ADMIN = "State Admin",
//   CENTRAL_ADMIN = "Central Admin",
//   LEARNERS = "Learners",
//   FACILITATORS = "Facilitators",
//   CONTENT_CREATOR = "Content Creator",
//   CONTENT_REVIEWER = "Content Reviewer",
//   SCTA = "State Content Team Associate (SCTA)",
//   CCTA = "Central Content Team Associate (CCTA)"

// };

export enum Role {
  STUDENT = 'Learner',
  TEACHER = 'Instructor',
  TEAM_LEADER = 'Lead',
  ADMIN = 'State Lead',
  CENTRAL_ADMIN = 'Central Lead',
  LEARNERS = 'Learner',
  FACILITATORS = 'Facilitators',
  TEAM_LEADERS = 'Team Leaders',
  CONTENT_CREATOR = 'Content Creator',
  CONTENT_REVIEWER = 'Content Reviewer',
  SCTA = 'Content creator',
  CCTA = 'Content reviewer',
}

export enum TenantName {
  SECOND_CHANCE_PROGRAM = 'Second Chance Program',
  YOUTHNET = 'YouthNet',
  POS = 'Open School',
}

export enum Status {
  ARCHIVED = 'archived',
  ARCHIVED_LABEL = 'Archived',
  ACTIVE = 'active',
  ACTIVE_LABEL = 'Active',
  ALL_LABEL = 'All',
  INACTIVE = 'InActive',
  PUBLISHED = 'published',
  DRAFT = 'draft',
  UNPUBLISHED = 'Unpublished',
  ISSUED = 'Issued',
  NOT_ISSUED = 'Not Issued',
}
export enum SORT {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export enum Storage {
  USER_DATA = 'userData',
  NAME = 'name',
  USER_ID = 'userId',
}
export enum FormContext {
  USERS = 'USERS',
  COHORTS = 'cohorts',
}
export enum TelemetryEventType {
  CLICK = 'CLICK',
  SEARCH = 'SEARCH',
  VIEW = 'VIEW',
  RADIO = 'RADIO',
}
export enum FormContextType {
  STUDENT = 'LEARNER',
  TEACHER = 'INSTRUCTOR',
  TEAM_LEADER = 'LEAD',
  ADMIN = 'State Lead',
  ADMIN_CENTER = 'Central Lead',
  COHORT = 'COHORT',
  CONTENT_CREATOR = 'CONTENT CREATOR',
}

export enum RoleId {
  STUDENT = 'eea7ddab-bdf9-4db1-a1bb-43ef503d65ef',
  TEACHER = 'a5f1dbc9-2ad4-442c-b762-0e3fc1f6c6da',
  TEAM_LEADER = 'c4454929-954e-4c51-bb7d-cca834ab9375',
  ADMIN = '4a3493aa-a4f7-4e2b-b141-f213084b5599',
  SCTA = '45b8b0d7-e5c6-4f3f-a7bf-70f86e9357ce',
  CONTENT_CREATOR = '45b8b0d7-e5c6-4f3f-a7bf-70f86e9357ce',
  CONTENT_REVIEWER = '2dc13fcc-29c4-42c1-b125-82d3dcaa4b42',
  STATE_LEAD = '4a3493aa-a4f7-4e2b-b141-f213084b5599',
}

export enum RoleName {
  CONTENT_CREATOR = 'Content creator',
  CONTENT_REVIEWER = 'Content reviewer',
  STATE_LEAD = 'State Lead',
}

export enum DataKey {
  UPDATED_AT = 'updatedAt',
  CREATED_AT = 'createdAt',
  ACTIONS = 'actions',
  CREATED_BY = 'createdBy',
  UPDATED_BY = 'updatedBy',
  STATUS = 'status',
  NAME = 'name',
  ACTIVE_MEMBER = 'totalActiveMembers',
  ARCHIVED_MEMBERS = 'totalArchivedMembers',
  TEMPLATE_TYPE = 'templateType',
}

export enum DateFormat {
  YYYY_MM_DD = 'yyyy-MM-dd',
}

export enum Numbers {
  ZERO = 0,
  ONE = 1,
  FIVE = 5,
  TEN = 10,
  FIFTEEN = 15,
  TWENTY = 20,
}

export enum CohortTypes {
  BATCH = 'BATCH',
  COHORT = 'COHORT',
  BLOCK = 'BLOCK',
  DISTRICT = 'DISTRICT',
  STATE = 'STATE',
}

export enum FormValues {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  REGULAR = 'REGULAR',
  REMOTE = 'REMOTE',
  TRANSGENDER = 'TRANSGENDER',
}

export enum InputTypes {
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  NUMERIC = 'numeric',
  TEXT = 'text',
}
export enum apiCatchingDuration {
  GETREADFORM = 36000000,
}

export const QueryKeys = {
  USER_READ: 'userRead',
  FIELD_OPTION_READ: 'fieldOptionRead',
  MY_COHORTS: 'myCohorts',
  GET_COHORT_LIST: 'getcohortList',
  GET_STATE_COHORT_LIST: 'getStateCohortList',
  GET_COHORT_MEMBER_LIST: 'getCohortMemberList',
  GET_ALL_NOTIFICATION_TEMPLATE: 'getAllNotificationTemplate',
  GET_NOTIFICATION_TEMPLATE_BY_KEY: 'getNotificationTemplateByKey',
};

export const monthColors: any = {
  Jan: '#99CCFF',
  Mar: '#D9B2FF',
  Apr: '#FFABAB',
  May: '#FFABAB',
  Jun: '#FFABAB',
  Jul: '#FFABAB',
  Aug: '#FFABAB',
  Sep: '#FFABAB',
  Oct: '#FFD6D6',
  Nov: '#FFD6D6',
  Dec: '#FFD6D6',
};

export enum ResourceType {
  LEARNER_PRE_REQUISITE = 'prerequisite',
  LEARNER_POST_REQUISITE = 'postrequisite',
  FACILITATOR_REQUISITE = 'facilitator-requisite',
}

import { StaticImageData } from 'next/image'; // Import StaticImageData for type safety with images

export enum ContentType {
  PDF = 'application/pdf',
  EPUB = 'application/epub',
  HTML = 'application/vnd.ekstep.html-archive',
  VIDEO_MP4 = 'video/mp4',
  QUESTION_SET = 'application/vnd.sunbird.questionset',
  H5P = 'application/vnd.ekstep.h5p-archive',
  YOUTUBE_VIDEO = 'video/youtube',
  YOUTUBE_X_VIDEO = 'video/x-youtube',
  WEBM_VIDEO = 'video/webm',
  VND = 'application/vnd.ekstep.content-collection',
}

export type FileType = {
  [key in ContentType]: {
    name: string;
    imgPath: StaticImageData;
    BgImgPath?: StaticImageData;
  };
};

// Create the mapping object with enum keys
export const ContentCardsTypes: FileType = {
  [ContentType.PDF]: { name: 'PDF', imgPath: pdf, BgImgPath: bgpdf },
  [ContentType.EPUB]: { name: 'EPUB', imgPath: epub, BgImgPath: bgepub },
  [ContentType.HTML]: { name: 'HTML', imgPath: html, BgImgPath: bghtml },
  [ContentType.VIDEO_MP4]: { name: 'Video', imgPath: mp4, BgImgPath: bgmp4 },
  [ContentType.QUESTION_SET]: {
    name: 'Question Set',
    imgPath: qml,
    BgImgPath: bgqml,
  },
  [ContentType.H5P]: { name: 'H5P', imgPath: html, BgImgPath: bghtml },
  [ContentType.YOUTUBE_X_VIDEO]: {
    name: 'YouTube',
    imgPath: youtube,
    BgImgPath: bgyoutube,
  },
  [ContentType.YOUTUBE_VIDEO]: {
    name: 'YouTube',
    imgPath: youtube,
    BgImgPath: bgyoutube,
  },
  [ContentType.WEBM_VIDEO]: { name: 'WEBM', imgPath: mp4, BgImgPath: bgmp4 },
  [ContentType.VND]: { name: 'WEBM', imgPath: html, BgImgPath: bghtml },
};
export enum fieldKeys {
  GENDER = 'gender',
}

export const DEFAULT_TEMPLATE_CONTEXT = ['USER', 'OTP', 'CMS'];
