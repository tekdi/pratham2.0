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
export enum Role {
  SCTA = "State Content Team Associate (SCTA)",
  CCTA="Central Content Team Associate (CCTA)"
}
export enum ContentStatus {
  PUBLISHED = "Published",
  REJECTED="Rejected"
}
export const SortOptions = ["Modified On", "Created On"];
export const StatusOptions = ["Live", "Review" ,  "Draft", "All"];


export const LIMIT = 10;

export const PrimaryCategoryValue = [
  "Course",
  "eTextbook",
  "Explanation Content",
  "Learning Resource",
  "Practice Question Set",
  "Teacher Resource"
];

export const TENANT_DATA = {
  SECOND_CHANCE_PROGRAM: 'Second Chance Program',
};