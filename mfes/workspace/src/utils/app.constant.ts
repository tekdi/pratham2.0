export enum Status {
  DRAFT = "Draft",
  LIVE = "Live",
  SUBMITTED_FOR_REVIEW = "Review",
}

export enum ContentType {
  QUESTION_SET = "QuestionSet",
}
export enum Role {
  SCTA = "State Admin SCTA",
  CCTA="Central Admin CCTA"
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
