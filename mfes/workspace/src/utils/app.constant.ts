export enum Status {
  DRAFT = "Draft",
  LIVE = "Live",
  SUBMITTED_FOR_REVIEW = "Review",
}

export enum ContentType {
  QUESTION_SET = "QuestionSet",
}
export enum Editor {
  CONTENT = "content",
  QUESTION_SET = "questionset",
  COLLECTION="collection"
}

export enum Publish {
 PUBLISH ='publish',
 REJECT='reject'
}
export enum Role {
  SCTA = "Content creator",
  CCTA = "Content reviewer",
  CENTRAL_ADMIN = "Central Lead",
}
export enum ContentStatus {
  PUBLISHED = "Published",
  REJECTED="Rejected"
}
export const SortOptions = ["Modified On", "Created On"];
export const StatusOptions = ["Live", "Review" ,  "Draft", "All"];


export const LIMIT = 10;

export const PrimaryCategoryValue = [
  'Course',
  'eTextbook',
  'Explanation Content',
  'Learning Resource',
  'Practice Question Set',
  'Teacher Resource',
  'Activity',
  'Story',

  'Content Playlist',
  'Digital Textbook',
  'Question paper',
  'Course Assessment',

  'Exam Question',
];

export const TENANT_DATA = {
  TENANT_NAME: 'tenantName',
  SECOND_CHANCE_PROGRAM: 'Second Chance Program',
  PRATHAM_SCP: 'pratham SCP',
  YOUTHNET: 'Vocational Training',
  POS : 'Open School',
  PRAGYANPATH : 'Pragyanpath',
  CAMP_TO_CLUB : 'Camp to Club'

};