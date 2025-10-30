import axios from 'axios';
import { AnyARecord } from 'dns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import {
  createAssessmentTracking,
  updateAssessmentScore,
} from '../../services/AssesmentService';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export interface QuestionMarksManualUpdateProps {
  assessmentDoId: any;
  userId: any;
  assessmentStatusData: any;
  parentId?: any;
  unitId?: any;
}

const QuestionMarksManualUpdate: React.FC<QuestionMarksManualUpdateProps> = ({
  assessmentDoId,
  userId,
  assessmentStatusData,
  parentId,
  unitId,
}) => {
  const router = useRouter();
  const [do_id, set_do_id] = useState<any>(assessmentDoId);

  //data fetch variable
  const [status, set_status] = useState<string>('');
  const [error, set_error] = useState<boolean>(false);
  const [content_details, set_content_details] = useState<any>(null);
  const [api_index_map, set_api_index_map] = useState<any>(null);
  const [marksBySection, set_marksBySection] = useState<
    Record<string, number[]>
  >({});
  const [marksTextBySection, set_marksTextBySection] = useState<
    Record<string, string[]>
  >({});
  const [selectedOptions, set_selectedOptions] = useState<
    Record<string, number | null>
  >({});
  const [submitPayload, set_submitPayload] = useState<any>(null);
  const [isSubmitting, set_isSubmitting] = useState<boolean>(false);
  const [zoomImageSrc, set_zoomImageSrc] = useState<string | null>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement | null>(null);
  const [zoomScale, set_zoomScale] = useState<number>(1);
  const [panX, set_panX] = useState<number>(0);
  const [panY, set_panY] = useState<number>(0);
  const isPanningRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchRef = useRef<{
    active: boolean;
    initialDistance: number;
    initialScale: number;
  }>({
    active: false,
    initialDistance: 0,
    initialScale: 1,
  });

  useEffect(() => {
    // Reset zoom state when opening/closing fullscreen view
    if (zoomImageSrc) {
      set_zoomScale(1);
      set_panX(0);
      set_panY(0);
    }
  }, [zoomImageSrc]);

  //temp variable
  const [list_temp_load, set_list_temp_load] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const getDoIdAndDownload = async () => {
      set_status('Getting DO ID');
      let local_do_id: string | null = do_id;
      console.log('######## doid', local_do_id);
      if (local_do_id) {
        set_status('Got DO ID');
        set_do_id(local_do_id);
        await downloadContentQuML(local_do_id);
      } else {
        set_error(true);
      }
    };
    if (do_id) {
      getDoIdAndDownload();
    }
  }, [do_id]);

  //downlaod question set
  const downloadContentQuML = async (content_do_id: string) => {
    //content read
    set_status('Reading Content...');
    //get data online
    let content_response: any = await hierarchyContent(content_do_id);
    if (content_response == null) {
      set_status('Invalid Do Id...');
      set_error(true);
    } else {
      let contentObj = content_response?.result?.questionSet;
      //fix for response with questionset
      if (!contentObj) {
        contentObj = content_response?.result?.questionset;
      }
      //console.log('######## contentObj', contentObj);
      let filePath = '';
      if (contentObj?.mimeType == 'application/vnd.sunbird.questionset') {
        //find outcomeDeclaration
        let questionsetRead_response: any = await questionsetRead(
          content_do_id
        );

        // console.log(
        //   '######## questionsetRead_response',
        //   questionsetRead_response
        // );
        if (
          questionsetRead_response != null &&
          questionsetRead_response?.result?.questionset
        ) {
          contentObj.outcomeDeclaration =
            questionsetRead_response?.result?.questionset?.outcomeDeclaration;
        }
        filePath = `save`;
      }
      //console.log('######## ', contentObj);
      //console.log('######## filePath', filePath);
      //console.log('######## ');
      if (filePath != '') {
        //create file and store object in local
        try {
          //console.log('permission got');
          try {
            //create directory
            set_status('Creating Folder...');
            // console.log('folder created successfully:', filePath);
            //create directory and add json file in it
            set_status('Downloading questionset...');
            //downlaod here
            let childNodes: string[] =
              (contentObj?.childNodes as string[]) || [];
            //console.log('childNodes', childNodes);
            let removeNodes: string[] = [];
            if (contentObj?.children) {
              for (let i = 0; i < contentObj.children.length; i++) {
                if (contentObj.children[i]?.identifier) {
                  removeNodes.push(contentObj.children[i].identifier);
                }
              }
            }
            //console.log('removeNodes', removeNodes);
            let identifiers: string[] = childNodes.filter(
              (item: string) => !removeNodes.includes(item)
            );
            //console.log('identifiers', identifiers);
            let questions: any[] = [];
            const chunks: string[][] = [];
            let chunkSize = 10;
            for (let i = 0; i < identifiers.length; i += chunkSize) {
              chunks.push(identifiers.slice(i, i + chunkSize));
            }
            console.log('chunks', chunks);
            for (const chunk of chunks) {
              let response_question: any = await listQuestion(
                questionListUrl,
                chunk
              );
              if (response_question?.result?.questions) {
                for (
                  let i = 0;
                  i < response_question.result.questions.length;
                  i++
                ) {
                  questions.push(response_question.result.questions[i]);
                }
                //console.log('chunk', chunk);
                //console.log('response_question', response_question);
              }
            }
            // console.log('questions', questions.length);
            // console.log('identifiers', identifiers.length);
            console.log('questions');
            if (questions.length == identifiers.length) {
              console.log('plp');

              //add questions in contentObj for offline use
              let temp_contentObj = contentObj;
              if (contentObj?.children) {
                for (let i = 0; i < contentObj.children.length; i++) {
                  if (contentObj.children[i]?.children) {
                    for (
                      let j = 0;
                      j < contentObj.children[i]?.children.length;
                      j++
                    ) {
                      let temp_obj = contentObj.children[i]?.children[j];
                      if (temp_obj?.identifier) {
                        // Example usage
                        const identifierToFind = temp_obj.identifier;
                        const result_question = findObjectByIdentifier(
                          questions,
                          identifierToFind
                        );
                        //replace with question
                        temp_contentObj.children[i].children[j] =
                          result_question;
                      }
                    }
                  }
                }
              }
              contentObj = temp_contentObj;
              //end add questions in contentObj for offline use

              let question_result = {
                questions: questions,
                count: questions.length,
              };
              // build UI model from hierarchy
              const { uiModel, apiIndex } = buildUiModelFromContent(contentObj);
              console.log('uiModel', uiModel);
              set_content_details(uiModel);
              set_api_index_map(apiIndex);
              set_status('Completed...');
            } else {
              set_status('Invalid File');
              set_error(true);
            }
            //end download
          } catch (error) {
            set_status(`Failed to create file: ${error}`);
            set_error(true);
          }
        } catch (err) {
          set_status(`Failed to create file: ${err}`);
          set_error(true);
        }
      } else {
        set_status('Invalid File');
        set_error(true);
      }
    }
  };

  const addInlineStylesToImgTags = (html: string): string => {
    if (typeof html !== 'string' || html.trim() === '') return html;
    try {
      return html.replace(/<img\b[^>]*>/gi, (imgTag: string) => {
        // If style attribute exists, append our constraints; otherwise add a new style attribute
        if (/style\s*=\s*(['"]).*?\1/i.test(imgTag)) {
          return imgTag.replace(
            /style\s*=\s*(['"])(.*?)\1/i,
            (_match, quote, value) => {
              const trimmed = String(value || '').trim();
              const needsSemicolon =
                trimmed.length > 0 && !trimmed.endsWith(';');
              const appended = `${trimmed}${
                needsSemicolon ? ';' : ''
              } max-width:100%; height:auto; object-fit:contain; width:auto; max-height:320px; cursor:zoom-in;`;
              return `style=${quote}${appended}${quote}`;
            }
          );
        }
        return imgTag.replace(
          />$/,
          ' style="max-width:100%; height:auto; object-fit:contain; width:auto; max-height:320px; cursor:zoom-in;">'
        );
      });
    } catch (_e) {
      return html;
    }
  };

  const extractImageSrcs = (html: string): string[] => {
    if (typeof html !== 'string') return [];
    const matches = Array.from(
      html.matchAll(/<img[^>]+src=['\"]([^'\"]+)['\"][^>]*>/gi)
    );
    return matches.map((m: any) => (m && m[1]) || '').filter(Boolean);
  };

  //common function
  const findObjectByIdentifier = (array: any, identifier: any) => {
    return array.find((item: any) => item.identifier === identifier);
  };

  // transform questionset hierarchy to UI model and API index map
  const buildUiModelFromContent = (content: any) => {
    const ui: any = {
      organization: content?.organization,
      program:
        (Array.isArray(content?.program) && content.program.join(', ')) ||
        content?.program,
      name: content?.name,
      paperMarks: 0,
      sections: [] as any[],
    };
    const apiIndex: any = { sections: [] as any[] };
    if (!Array.isArray(content?.children)) return { uiModel: ui, apiIndex };
    let paperTotal = 0;
    for (let i = 0; i < content.children.length; i++) {
      const sectionNode = content.children[i];
      if (
        !Array.isArray(sectionNode?.children) ||
        sectionNode.children.length === 0
      )
        continue;
      const sectionQuestions: any[] = [];
      let sectionTotal = 0;
      const apiSection: any = {
        sectionId: sectionNode?.identifier,
        sectionName: sectionNode?.name,
        data: [] as any[],
      };
      for (let j = 0; j < sectionNode.children.length; j++) {
        const q = sectionNode.children[j];
        const maxScore: number = Number(
          q?.maxScore ?? q?.outcomeDeclaration?.maxScore?.defaultValue ?? 0
        );
        sectionTotal += maxScore;
        const correctValue =
          q?.responseDeclaration?.response1?.correctResponse?.value;
        const opts = q?.interactions?.response1?.options || [];
        const options = opts.map((opt: any) => ({
          label: opt?.label ?? opt?.value?.body ?? '',
          value: typeof opt?.value === 'number' ? opt.value : opt?.value?.value,
          hint: opt?.hint ?? '',
        }));
        sectionQuestions.push({
          questionTitle: q?.body,
          maxScore,
          options,
        });
        const params = opts.map((opt: any) => ({
          answer:
            typeof correctValue !== 'undefined'
              ? (typeof opt?.value === 'number'
                  ? opt.value
                  : opt?.value?.value) === correctValue
              : false,
          value: {
            body: opt?.label ?? opt?.value?.body ?? '',
            value:
              typeof opt?.value === 'number' ? opt.value : opt?.value?.value,
          },
        }));
        const type: string =
          (q?.qType || '')?.toString().toLowerCase() ||
          (q?.primaryCategory === 'Multiple Choice Question' ? 'mcq' : 'sa');
        apiSection.data.push({
          item: {
            id: q?.identifier || null,
            title: q?.name || q?.body || '',
            type: type,
            maxscore: maxScore,
            params: params,
            sectionId: sectionNode?.identifier || '',
          },
          index: j + 1,
          pass: 'No',
          score: 0,
          resvalues: [],
          duration: 0,
          sectionName: sectionNode?.name || '',
        });
      }
      paperTotal += sectionTotal;
      ui.sections.push({
        sectionTitle: sectionNode?.name,
        totalMarks: sectionTotal,
        questions: sectionQuestions,
      });
      apiIndex.sections.push(apiSection);
    }
    ui.paperMarks =
      paperTotal ||
      Number(content?.outcomeDeclaration?.maxScore?.defaultValue ?? 0);
    return { uiModel: ui, apiIndex };
  };

  // initialize form state when content_details/api_index_map available
  useEffect(() => {
    if (!content_details?.sections || !api_index_map?.sections) return;
    const nextMarksBySection: Record<string, number[]> = {};
    const nextMarksTextBySection: Record<string, string[]> = {};
    const nextSelected: Record<string, number | null> = {};

    // Build a quick lookup for scores from assessmentStatusData using sectionId + questionId
    const statusList = Array.isArray(assessmentStatusData)
      ? assessmentStatusData
      : [];
    const scoreBySectionQuestion: Record<string, number> = {};
    statusList.forEach((rec: any) => {
      if (rec?.sectionId && rec?.questionId) {
        const scoreNum = Number(rec?.score ?? 0);
        scoreBySectionQuestion[`${rec.sectionId}::${rec.questionId}`] =
          Number.isFinite(scoreNum) ? scoreNum : 0;
      }
    });

    content_details.sections.forEach((section: any, si: number) => {
      const apiSection = api_index_map?.sections?.[si];
      const sectionId = apiSection?.sectionId;
      const numericArr: number[] = (section.questions || []).map(
        (_q: any, qi: number) => {
          const questionId = apiSection?.data?.[qi]?.item?.id;
          if (sectionId && questionId) {
            const key = `${sectionId}::${questionId}`;
            const score = scoreBySectionQuestion[key];
            if (typeof score !== 'undefined') return score;
          }
          return 0;
        }
      );
      nextMarksBySection[String(si)] = numericArr;
      nextMarksTextBySection[String(si)] = numericArr.map((n) =>
        Number(n) === 0 ? '0' : String(n)
      );

      (section.questions || []).forEach((q: any, qi: number) => {
        const key = `${si}_${qi}`;
        // For MCQ type (has options), default to null (unselected)
        if (q?.options && Array.isArray(q.options)) {
          nextSelected[key] = null;
        }
      });
    });
    set_marksBySection(nextMarksBySection);
    set_marksTextBySection(nextMarksTextBySection);
    set_selectedOptions(nextSelected);
  }, [content_details, api_index_map, assessmentStatusData]);

  const handleMarksTextChange = (
    sectionIndex: number,
    questionIndex: number,
    textValue: string
  ) => {
    const max =
      content_details?.sections?.[sectionIndex]?.questions?.[questionIndex]
        ?.maxScore || 0;
    const onlyDigits = (textValue || '').replace(/[^0-9]/g, '');
    if (onlyDigits === '') {
      set_marksTextBySection((prev) => {
        const arr = [...(prev[String(sectionIndex)] || [])];
        arr[questionIndex] = '';
        return { ...prev, [String(sectionIndex)]: arr };
      });
      set_marksBySection((prev) => {
        const arr = [...(prev[String(sectionIndex)] || [])];
        arr[questionIndex] = 0;
        return { ...prev, [String(sectionIndex)]: arr };
      });
      return;
    }
    // Normalize leading zeros: "000" -> "0", "0012" -> "12"
    let normalized = onlyDigits.replace(/^0+/, '');
    if (normalized === '') normalized = '0';
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) return;
    // Reject values above max: keep previous valid value unchanged
    if (parsed > max) return;
    set_marksTextBySection((prev) => {
      const arr = [...(prev[String(sectionIndex)] || [])];
      arr[questionIndex] = normalized;
      return { ...prev, [String(sectionIndex)]: arr };
    });
    set_marksBySection((prev) => {
      const arr = [...(prev[String(sectionIndex)] || [])];
      arr[questionIndex] = parsed;
      return { ...prev, [String(sectionIndex)]: arr };
    });
  };

  const handleMarksBlur = (sectionIndex: number, questionIndex: number) => {
    const max =
      content_details?.sections?.[sectionIndex]?.questions?.[questionIndex]
        ?.maxScore || 0;
    const text =
      marksTextBySection[String(sectionIndex)]?.[questionIndex] ?? '';
    if (text === '') {
      // keep UI empty but ensure numeric is 0
      set_marksBySection((prev) => {
        const arr = [...(prev[String(sectionIndex)] || [])];
        arr[questionIndex] = 0;
        return { ...prev, [String(sectionIndex)]: arr };
      });
      return;
    }
    const num = Number(text);
    const safe = Number.isFinite(num) ? Math.max(0, Math.min(num, max)) : 0;
    set_marksBySection((prev) => {
      const arr = [...(prev[String(sectionIndex)] || [])];
      arr[questionIndex] = safe;
      return { ...prev, [String(sectionIndex)]: arr };
    });
    set_marksTextBySection((prev) => {
      const arr = [...(prev[String(sectionIndex)] || [])];
      arr[questionIndex] = safe === 0 ? '0' : String(safe);
      return { ...prev, [String(sectionIndex)]: arr };
    });
  };

  const handleOptionChange = (
    sectionIndex: number,
    questionIndex: number,
    optionIndex: number,
    isCorrectValue?: number
  ) => {
    const key = `${sectionIndex}_${questionIndex}`;
    set_selectedOptions((prev) => ({ ...prev, [key]: optionIndex }));
    // optional: auto-assign marks for MCQ if value indicates correctness
    if (typeof isCorrectValue === 'number') {
      set_marksBySection((prev) => {
        const arr = [...(prev[String(sectionIndex)] || [])];
        const questionMax =
          content_details?.sections?.[sectionIndex]?.questions?.[questionIndex]
            ?.maxScore || 0;
        const awarded = isCorrectValue === 1 ? questionMax : 0;
        arr[questionIndex] = awarded;
        return { ...prev, [String(sectionIndex)]: arr };
      });
    }
  };

  const handleMarksChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    // Allow empty string during typing
    if (value === '') {
      set_marksBySection((prev) => {
        const arr = [...(prev[String(sectionIndex)] || [])];
        arr[questionIndex] = 0;
        return { ...prev, [String(sectionIndex)]: arr };
      });
      return;
    }
    const num = Number(value);
    const max =
      content_details?.sections?.[sectionIndex]?.questions?.[questionIndex]
        ?.maxScore || 0;
    const safe = Number.isFinite(num) ? Math.max(0, Math.min(num, max)) : 0;
    set_marksBySection((prev) => {
      const arr = [...(prev[String(sectionIndex)] || [])];
      arr[questionIndex] = safe;
      return { ...prev, [String(sectionIndex)]: arr };
    });
  };

  const sectionTotals = useMemo(() => {
    const totals: number[] = [];
    if (!content_details?.sections) return totals;
    content_details.sections.forEach((_: any, si: number) => {
      const arr = marksBySection[String(si)] || [];
      totals.push(
        arr.reduce((sum: number, v: number) => sum + (Number(v) || 0), 0)
      );
    });
    return totals;
  }, [marksBySection, content_details]);

  const overallTotal = useMemo(
    () => sectionTotals.reduce((a, b) => a + b, 0),
    [sectionTotals]
  );

  const handleSubmit = async () => {
    if (!content_details?.sections || !api_index_map?.sections) return;
    // Build assessmentSummary with scores from entered marks
    let totalMaxScore = 0;
    let totalScore = 0;
    const assessmentSummary = api_index_map.sections.map(
      (section: any, si: number) => {
        const data = section.data.map((entry: any, qi: number) => {
          const max = Number(entry?.item?.maxscore || 0);
          const awarded = Number(marksBySection[String(si)]?.[qi] || 0);
          totalMaxScore += max;
          totalScore += awarded;
          return {
            ...entry,
            pass: awarded > 0 ? 'Yes' : 'No',
            score: awarded,
            resvalues: [],
            duration: 0,
          };
        });
        return {
          sectionId: section.sectionId,
          sectionName: section.sectionName,
          data,
        };
      }
    );

    const payload = {
      userId: String(userId || ''),
      courseId: String(parentId || ''),
      unitId: String(unitId || ''),
      contentId: String(do_id || ''),
      attemptId: `${Date.now()}`,
      lastAttemptedOn: new Date().toISOString(),
      timeSpent: 0,
      totalMaxScore,
      totalScore,
      assessmentSummary,
    };

    set_submitPayload(payload);
    console.log('FORM_SUBMIT_RESULT', payload);
    try {
      set_isSubmitting(true);
      if (!assessmentStatusData || assessmentStatusData.length === 0) {
        const response = await createAssessmentTracking(payload);
        const updatePayload = {
          ...payload,
          submitedBy: 'Manual',
        };
        await updateAssessmentScore(updatePayload);
        router.reload();
      } else {
        const updatePayload = {
          ...payload,
          submitedBy: 'Manual',
        };
        const response = await updateAssessmentScore(updatePayload);
        // console.log('API success update:', response);
        router.reload();
      }
    } catch (error) {
      console.error('API error while creating assessment tracking:', error);
      set_isSubmitting(false);
    }
  };
  //network call
  const API_URL = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
  const questionListUrl =
    process.env.NEXT_PUBLIC_MIDDLEWARE_URL + '/api/question/v2/list';
  //hierarchy content
  const hierarchyContent = async (content_do_id: string) => {
    // console.log({ content_do_id });
    const url = `${API_URL}/action/questionset/v2/hierarchy/` + content_do_id;

    let api_response = null;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };

    await axios
      .request(config)
      .then((response) => {
        api_response = response.data;
      })
      .catch((error) => {
        console.log('############');
        console.log('############ config', config);
        console.log('############ read content error', error);
        console.log('############');
      });

    return api_response;
  };

  //outcomeDeclaration questionset
  const questionsetRead = async (content_do_id: string) => {
    console.log({ content_do_id });
    const url =
      `${API_URL}/action/questionset/v2/read/` +
      content_do_id +
      `?fields=instructions,outcomeDeclaration`;

    let api_response = null;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };

    await axios
      .request(config)
      .then((response) => {
        api_response = response.data;
      })
      .catch((error) => {
        console.log('############');
        console.log('############ config', config);
        console.log('############ read content error', error);
        console.log('############');
      });

    return api_response;
  };

  //list question
  const listQuestion = async (url: any, identifiers: any) => {
    let data = JSON.stringify({
      request: {
        search: {
          identifier: identifiers,
        },
      },
    });

    let api_response = null;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        api_response = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return api_response;
  };

  return (
    <div
      style={{
        maxHeight: '55vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {content_details && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div>
              <b>{content_details?.organization}</b>
            </div>
            <div>{content_details?.program}</div>
            <div style={{ marginTop: 4 }}>
              <b>Paper:</b> {content_details?.name} | <b>Max Marks:</b>{' '}
              {content_details?.paperMarks}
            </div>
          </div>

          {content_details.sections?.map((section: any, si: number) => (
            <div
              key={si}
              style={{
                border: '1px solid #DBDBDB',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <div>
                  <b>Section:</b> {section.sectionTitle}
                </div>
                <div>
                  <b>Section Max:</b> {section.totalMarks} | <b>Awarded:</b>{' '}
                  {sectionTotals[si] || 0}
                </div>
              </div>
              <div>
                {section.questions?.map((q: any, qi: number) => {
                  const hasImage =
                    typeof q?.questionTitle === 'string' &&
                    /<img\b/i.test(q.questionTitle);
                  const questionHtml = hasImage
                    ? addInlineStylesToImgTags(q.questionTitle)
                    : q.questionTitle;
                  return (
                    <div
                      key={qi}
                      style={{
                        borderTop: '1px dashed #eee',
                        paddingTop: 8,
                        marginTop: 8,
                      }}
                    >
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontWeight: 600 }}>
                          Q{qi + 1} (Max {q.maxScore})
                        </div>
                        <div
                          style={
                            hasImage
                              ? {
                                  width: 'fit-content',
                                  display: 'inline-block',
                                  border: '1px solid #eee',
                                  borderRadius: 8,
                                  padding: 8,
                                  paddingRight: 0,
                                  background: '#fff',
                                  marginTop: '0px',
                                  position: 'relative',
                                }
                              : undefined
                          }
                        >
                          <div
                            onClick={(e) => {
                              if (!hasImage) return;
                              const t = e.target as HTMLElement | null;
                              if (t && t.tagName === 'IMG') {
                                const srcs = extractImageSrcs(q.questionTitle);
                                const src = srcs[0] ?? null;
                                set_zoomImageSrc(src);
                                const el: any = fullScreenContainerRef.current;
                                if (src && el && el.requestFullscreen) {
                                  el.requestFullscreen().catch(() => {});
                                }
                              }
                            }}
                            dangerouslySetInnerHTML={{ __html: questionHtml }}
                          />
                          {hasImage && (
                            <IconButton
                              aria-label="Zoom image"
                              onClick={() => {
                                const srcs = extractImageSrcs(q.questionTitle);
                                const src = srcs[0] ?? null;
                                set_zoomImageSrc(src);
                                const el: any = fullScreenContainerRef.current;
                                if (src && el && el.requestFullscreen) {
                                  el.requestFullscreen().catch(() => {});
                                }
                              }}
                              sx={{
                                position: 'absolute',
                                top: '20%',
                                right: 0,
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(255,255,255,0.9)',
                                boxShadow: 1,
                                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                              }}
                              size="small"
                            >
                              <ZoomInIcon fontSize="medium" />
                            </IconButton>
                          )}
                        </div>
                      </div>
                      {api_index_map?.sections?.[si]?.data?.[qi]?.item?.type !==
                        'mcq' &&
                        q?.options &&
                        Array.isArray(q.options) &&
                        q.options.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            {q.options.map((opt: any, oi: number) => (
                              <label
                                key={oi}
                                style={{ display: 'block', cursor: 'pointer' }}
                              >
                                <input
                                  type="radio"
                                  name={`mcq_${si}_${qi}`}
                                  checked={
                                    selectedOptions[`${si}_${qi}`] === oi
                                  }
                                  onChange={() =>
                                    handleOptionChange(
                                      si,
                                      qi,
                                      oi,
                                      typeof opt?.value === 'number'
                                        ? opt.value
                                        : undefined
                                    )
                                  }
                                  style={{ marginRight: 6 }}
                                />
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: opt.label,
                                  }}
                                />
                              </label>
                            ))}
                          </div>
                        )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <label style={{ fontWeight: 500 }}>Marks:</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min={0}
                          max={q.maxScore}
                          value={
                            (marksTextBySection[String(si)]?.[qi] ?? '') !== ''
                              ? marksTextBySection[String(si)]?.[qi]
                              : ''
                          }
                          placeholder={String(
                            marksBySection[String(si)]?.[qi] ?? 0
                          )}
                          onChange={(e) => {
                            const onlyDigits = e.target.value.replace(
                              /[^0-9]/g,
                              ''
                            );
                            handleMarksTextChange(si, qi, onlyDigits);
                          }}
                          onBlur={() => handleMarksBlur(si, qi)}
                          style={{ width: 80 }}
                        />
                        <span>/ {q.maxScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: '2px solid #DBDBDB',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              Overall Awarded: {overallTotal} / {content_details?.paperMarks}
            </div>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                mt: 1,
                px: 1.5,
                py: 1,
                mb: 1,
                borderRadius: '10px',
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: '#FFC107',
                color: '#1F1B13',
                '&:hover': { backgroundColor: '#FFB300' },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <CircularProgress size={18} color="inherit" />
                  {assessmentStatusData && assessmentStatusData.length > 0
                    ? t('ASSESSMENTS.UPDATING')
                    : t('ASSESSMENTS.SUBMITTING')}
                </span>
              ) : assessmentStatusData && assessmentStatusData.length > 0 ? (
                t('ASSESSMENTS.UPDATE_MARKS')
              ) : (
                t('ASSESSMENTS.SUBMIT_MARKS')
              )}
            </Button>
          </div>
        </div>
      )}
      <div
        ref={fullScreenContainerRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
          zIndex: 1300,
          display: zoomImageSrc ? 'block' : 'none',
        }}
        onWheel={(e) => {
          if (!zoomImageSrc) return;
          e.preventDefault();
          const delta = e.deltaY;
          set_zoomScale((prev) => {
            const next = Math.min(
              6,
              Math.max(1, prev + (delta > 0 ? -0.2 : 0.2))
            );
            return Number.isFinite(next) ? next : prev;
          });
        }}
        onMouseDown={(e) => {
          if (!zoomImageSrc || zoomScale <= 1) return;
          isPanningRef.current = true;
          lastPointRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseMove={(e) => {
          if (!isPanningRef.current) return;
          const dx = e.clientX - lastPointRef.current.x;
          const dy = e.clientY - lastPointRef.current.y;
          lastPointRef.current = { x: e.clientX, y: e.clientY };
          set_panX((p) => p + dx);
          set_panY((p) => p + dy);
        }}
        onMouseUp={() => {
          isPanningRef.current = false;
        }}
        onMouseLeave={() => {
          isPanningRef.current = false;
        }}
        onTouchStart={(e) => {
          if (!zoomImageSrc) return;
          if (e.touches.length === 2) {
            pinchRef.current.active = true;
            const t1 = e.touches.item(0);
            const t2 = e.touches.item(1);
            if (!t1 || !t2) return;
            const dist = Math.hypot(
              t2.clientX - t1.clientX,
              t2.clientY - t1.clientY
            );
            pinchRef.current.initialDistance = dist;
            pinchRef.current.initialScale = zoomScale;
          } else if (e.touches.length === 1 && zoomScale > 1) {
            isPanningRef.current = true;
            const t = e.touches.item(0);
            if (!t) return;
            lastPointRef.current = { x: t.clientX, y: t.clientY };
          }
        }}
        onTouchMove={(e) => {
          if (!zoomImageSrc) return;
          if (pinchRef.current.active && e.touches.length === 2) {
            e.preventDefault();
            const t1 = e.touches.item(0);
            const t2 = e.touches.item(1);
            if (!t1 || !t2) return;
            const dist = Math.hypot(
              t2.clientX - t1.clientX,
              t2.clientY - t1.clientY
            );
            const scaleFactor = dist / (pinchRef.current.initialDistance || 1);
            const next = Math.min(
              6,
              Math.max(1, pinchRef.current.initialScale * scaleFactor)
            );
            set_zoomScale(Number.isFinite(next) ? next : 1);
          } else if (isPanningRef.current && e.touches.length === 1) {
            const t = e.touches.item(0);
            if (!t) return;
            const dx = t.clientX - lastPointRef.current.x;
            const dy = t.clientY - lastPointRef.current.y;
            lastPointRef.current = { x: t.clientX, y: t.clientY };
            set_panX((p) => p + dx);
            set_panY((p) => p + dy);
          }
        }}
        onTouchEnd={() => {
          pinchRef.current.active = false;
          isPanningRef.current = false;
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={() => {
            set_zoomImageSrc(null);
            const doc: any = document;
            if (doc.fullscreenElement && doc.exitFullscreen) {
              doc.exitFullscreen().catch(() => {});
            }
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            bgcolor: 'rgba(255,255,255,0.2)',
          }}
        >
          <CloseIcon sx={{ color: '#fff' }} />
        </IconButton>
        {zoomImageSrc && (
          <img
            src={zoomImageSrc}
            alt="Zoomed"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${zoomScale})`,
              transformOrigin: 'center center',
              maxWidth: '100vw',
              maxHeight: '100vh',
              objectFit: 'contain',
              cursor: zoomScale > 1 ? 'grab' : 'default',
            }}
            draggable={false}
          />
        )}

        {zoomImageSrc && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 8,
              background: 'rgba(0,0,0,0.4)',
              padding: 8,
              borderRadius: 8,
            }}
          >
            <IconButton
              aria-label="Zoom out"
              onClick={() =>
                set_zoomScale((z) => Math.max(1, +(z - 0.25).toFixed(2)))
              }
              sx={{ bgcolor: 'rgba(255,255,255,0.85)' }}
            >
              <ZoomOutIcon />
            </IconButton>
            <IconButton
              aria-label="Reset"
              onClick={() => {
                set_zoomScale(1);
                set_panX(0);
                set_panY(0);
              }}
              sx={{ bgcolor: 'rgba(255,255,255,0.85)' }}
            >
              <CenterFocusStrongIcon />
            </IconButton>
            <IconButton
              aria-label="Zoom in"
              onClick={() =>
                set_zoomScale((z) => Math.min(6, +(z + 0.25).toFixed(2)))
              }
              sx={{ bgcolor: 'rgba(255,255,255,0.85)' }}
            >
              <ZoomInIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionMarksManualUpdate;
