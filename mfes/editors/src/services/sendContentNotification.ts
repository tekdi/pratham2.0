import { formatDate } from "../utils/Helper";
import { sendCredentialService } from "./NotificationService";
import { getLocalStoredUserName } from "./LocalStorageService";
import { getUserDetailsInfo } from "./userServices";
import { ContentStatus, Editor } from "../utils/app.constant";

export const sendContentNotification = async (
    status: ContentStatus.PUBLISHED | ContentStatus.REJECTED,
    editorType:  Editor.CONTENT | Editor.QUESTION_SET | Editor.COLLECTION,
    comment = "",
    identifier?:any,
    contentInfo?:any,
    router?:any,
    returnPage?:any
  ) => {
    // const router = useRouter();

    try {
      const isQueue = false;
      const context = "CMS";
      const key = status ===  ContentStatus.PUBLISHED? "onContentPublish" : "onContentReject";
      let url = `${process.env.NEXT_PUBLIC_WORKSPACE_BASE_URL}/${editorType === Editor.CONTENT ? "upload-editor" : editorType === Editor.QUESTION_SET ? "editor" : "collection"}?identifier=${identifier}`;
  
      let contentDetails: any = {};
      if (editorType !== Editor.CONTENT) {
        const doId = identifier?.toString();
        if (doId) {
          const hierarchyResponse = await fetch(`/action/content/v3/read/${doId}`);
          const data = await hierarchyResponse.json();
          contentDetails = data?.result?.content;
        }
      } else {
        contentDetails = { ...contentInfo };
      }
  
      console.log("Content Details:", contentDetails);
      const userId = contentDetails?.createdBy;
      const response = await getUserDetailsInfo(userId, true);
      console.log("getUserDetailsInfo", response);
  
      const replacements: any = {
        "{reviewerName}": getLocalStoredUserName(),
        "{creatorName}": response?.userData?.firstName,
        "{contentId}": identifier,
        "{appUrl}": url,
        "{submissionDate}": formatDate(contentDetails?.createdOn),
        "{contentTitle}": contentDetails?.name,
        "{reviewDate}": formatDate(new Date().toString()),
        "{status}": status,
      };
  
      if (status ===  ContentStatus.REJECTED) {
        replacements["{reviwerComment}"] = editorType === Editor.CONTENT ? comment : contentDetails?.rejectComment;
      }
  
      await sendCredentialService({
        isQueue,
        context,
        key,
        replacements,
        email: { receipients: [response?.userData?.email] },
      });
  
      const previousPage = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('previousPage') : null;
      if (previousPage && previousPage.startsWith('/')) {
        const validPaths = [
          '/workspace/content/draft',
          '/workspace/content/up-review',
          '/workspace/content/publish',
          '/workspace/content/allContents',
          '/workspace/content/discover-contents',
        ];
        if (validPaths.some(p => previousPage.includes(p))) {
          router.push(previousPage);
          return;
        }
      }
      router.push({ pathname: "/workspace/content/up-review", query: returnPage ? { page: returnPage } : {} });
    } catch (error) {
      console.error("Error sending email notifications:", error);
    }
  };
  