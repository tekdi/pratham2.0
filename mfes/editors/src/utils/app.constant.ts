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
  SCTA = "Content creator",
  CCTA = "Content reviewer"
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
