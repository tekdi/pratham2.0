'use client';

import React, { useEffect, useState } from 'react';
import { BlobProvider, pdf } from '@react-pdf/renderer';
import axios from 'axios';
// @ts-ignore
import { saveAs } from 'file-saver';

//import for QuestionPaperPDF
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import moment from 'moment';

// utils/encryption.ts
import { useSearchParams } from 'next/navigation';

const QuestionPaperPDF = ({ data }: any) => {
  Font.register({
    family: 'UnicodeFont',
    fonts: [
      {
        src: '/fonts/NotoSansDevanagari-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: '/fonts/NotoSansDevanagari-Bold.ttf',
        fontWeight: 'bold',
      },
    ],
  });

  const gridCol = (cols: any) => ({
    width: `${(cols / 12) * 100}%`,
    padding: 4,
  });

  // Create styles
  const styles = StyleSheet.create({
    page: {
      padding: 50,
      flexDirection: 'column',
      fontFamily: 'UnicodeFont',
      fontSize: 12,
      justifyContent: 'space-between',
      position: 'relative',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 40,
      left: 0,
      right: 50,
      textAlign: 'right',
      color: 'black',
    },
    //MUI grid
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: '10px',
      wordBreak: 'normal', // Wrap at word boundaries
      whiteSpace: 'normal', // Respect spaces
    },
    box: {
      //   border: "1px solid #333",
      padding: 0,
      fontSize: 10,
      wordBreak: 'normal', // Wrap at word boundaries
      whiteSpace: 'normal', // Respect spaces
    },
    content: {
      marginTop: 30,
    },
    //text style
    title: {
      fontSize: 18,
      marginBottom: 10,
    },
    mid_title: {
      fontSize: 15,
      marginBottom: 7,
    },
    sub_title: {
      fontSize: 12,
      marginBottom: 5,
    },
    label: {
      fontSize: 12,
    },
    sub_label: { fontSize: 10 },
    //extra
    left: {
      textAlign: 'left',
    },
    center: {
      textAlign: 'center',
    },
    right: {
      textAlign: 'right',
    },
    bold: {
      fontWeight: 'bold',
    },
  });

  const toRoman = (num: number): string => {
    const romanMap: { [key: number]: string } = {
      1: 'i',
      2: 'ii',
      3: 'iii',
      4: 'iv',
      5: 'v',
      6: 'vi',
      7: 'vii',
      8: 'viii',
      9: 'ix',
      10: 'x',
      11: 'xi',
      12: 'xii',
      13: 'xiii',
      14: 'xiv',
      15: 'xv',
      16: 'xvi',
      17: 'xvii',
      18: 'xviii',
      19: 'xix',
      20: 'xx',
    };
    return romanMap[num] || num.toString();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={[gridCol(12), styles.box]}>
              {/*  */}
              <Text
                style={{ ...styles.title, ...styles.center, ...styles.bold }}
              >
                {data?.organization}
              </Text>
            </View>
            <View style={[gridCol(12), styles.box]}>
              <Text
                style={{ ...styles.title, ...styles.center, ...styles.bold }}
              >
                {data?.program}
              </Text>
            </View>
            <View style={[gridCol(6), styles.box]}>
              <Text
                style={{ ...styles.mid_title, ...styles.left, ...styles.bold }}
              >
                {data?.name}
              </Text>
            </View>
            <View style={[gridCol(6), styles.box]}>
              <Text
                style={{ ...styles.mid_title, ...styles.right, ...styles.bold }}
              >
                {`(${data?.paperMarks} Marks)`}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[gridCol(12), styles.box]}>
              <View
                style={{
                  borderBottom: '2px solid #000',
                }}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[gridCol(12), styles.box]}>
              <Text
                style={{
                  ...styles.sub_title,
                  ...styles.left,
                  ...styles.bold,
                }}
              >
                Exam Instructions
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  Take a plain white paper
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  Use pen with black or blue ink only
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  Write all the answers, including MCQs and fill-in-the-blanks,
                  on the piece of paper
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  Use the same numbering system as the question paper; take
                  extra care to write the numbers clearly
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  Write clearly and make sure the letters do not touch the edges
                  of the page
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  If a mistake is made, strike it out neatly and write it again
                </Text>
              </View>
              <Text
                style={{
                  ...styles.sub_title,
                  ...styles.left,
                  ...styles.bold,
                }}
              >
                परीक्षा निर्देश
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  एक सादा सफेद कागज़ लें
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  केवल काले या नीले इंक (ink) वाले पेन (pen) का उपयोग करें
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  सभी प्रश्न के उत्तर उसी कागज़ पर लिखें
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  प्रश्न पत्र की तरह ही नंबरिंग सिस्टम (numbering system – क्रम
                  संख्या प्रणाली) का उपयोग करें
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  क्रम संख्या साफ़-साफ़ लिखना सुनिश्चित करें
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  साफ़-साफ़ लिखें और ध्यान रखें कि अक्षर पन्ने के किनारों को न
                  छुएं
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles.sub_title,
                    ...styles.left,
                    marginLeft: 5,
                  }}
                >
                  यदि कोई गलती हो जाए, तो उसे एक बार में काटकर (strike out)
                  दोबारा साफ़-साफ़ लिखें
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[gridCol(12), styles.box]}>
              <View
                style={{
                  borderBottom: '2px solid #000',
                }}
              />
            </View>
          </View>
          <View style={styles.row}>
            {data?.sections?.map((section: any, sectionIndex: any) => (
              <View key={sectionIndex}>
                <View style={styles.row}>
                  <View style={[gridCol(10), styles.box]}>
                    <Text
                      style={{
                        ...styles.sub_title,
                        ...styles.left,
                        ...styles.bold,
                      }}
                    >
                      {/* ({String.fromCharCode(65 + sectionIndex)}){' '} */}
                      {`(${sectionIndex + 1})`} {section?.sectionTitle}
                    </Text>
                  </View>
                  <View style={[gridCol(2), styles.box]}>
                    <Text
                      style={{
                        ...styles.sub_title,
                        ...styles.right,
                        ...styles.bold,
                      }}
                    >
                      {`(${section?.totalMarks} Marks)`}
                    </Text>
                  </View>
                </View>
                {section?.questions?.map((question: any, qIndex: any) => {
                  let isQuestionImage = false;
                  let imageQuestionUrl = '';
                  if (question?.questionTitle.includes('<img')) {
                    isQuestionImage = true;
                    imageQuestionUrl =
                      question?.questionTitle.match(/src="([^"]*)"/)[1];
                  }
                  let questionTitle = question?.questionTitle
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, '');
                  return (
                    <View key={qIndex}>
                      <View style={styles.row}>
                        <View style={[gridCol(0.5), styles.box]}></View>
                        <View style={[gridCol(10.5), styles.box]}>
                          <Text
                            style={{
                              ...styles.sub_title,
                              ...styles.left,
                              ...styles.bold,
                            }}
                          >
                            {sectionIndex + 1}.{qIndex + 1} {questionTitle}
                          </Text>
                        </View>
                        <View style={[gridCol(1), styles.box]}>
                          <Text
                            style={{
                              ...styles.sub_title,
                              ...styles.right,
                              ...styles.bold,
                            }}
                          >
                            {`(${question?.maxScore})`}
                          </Text>
                        </View>
                        <View style={[gridCol(0.5), styles.box]}></View>
                        {isQuestionImage && (
                          <Image
                            src={imageQuestionUrl}
                            // src={clslogo}
                            style={{
                              width: 150, // adjust as needed
                              // height: 50,
                              // borderRadius: 0,
                            }}
                          />
                        )}
                      </View>
                      {question?.options?.map((option: any, oIndex: any) => {
                        let isImage = false;
                        let imageUrl = '';
                        if (option?.label.includes('<img')) {
                          isImage = true;
                          imageUrl = option?.label.match(/src="([^"]*)"/)[1];
                        }
                        let label = option?.label
                          .replace(/<[^>]*>/g, '')
                          .replace(/&nbsp;/g, '');
                        return (
                          <View style={styles.row} key={oIndex}>
                            <View style={[gridCol(1), styles.box]}></View>
                            <View style={[gridCol(11), styles.box]}>
                              <Text
                                style={{
                                  ...styles.sub_title,
                                  ...styles.left,
                                }}
                              >
                                {/* ({toRoman(oIndex + 1)}) {!isImage && label} */}
                                <Text>{String.fromCharCode(65 + oIndex)}.</Text>{' '}
                                {!isImage && label}
                              </Text>
                              {isImage && (
                                <Image
                                  src={imageUrl}
                                  // src={clslogo}
                                  style={{
                                    width: 50, // adjust as needed
                                    // height: 50,
                                    // borderRadius: 0,
                                  }}
                                />
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
        {/* Footer */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            // `Page ${pageNumber} of ${totalPages}`
            `${pageNumber}`
          }
          fixed // Important: keeps it on every page
        />
      </Page>
    </Document>
  );
};

export default function QP() {
  const searchParams = useSearchParams();
  const do_var = 'do_id';
  const [do_id, set_do_id] = useState<string | null>(null);
  const do_id_from_url = searchParams.get(do_var);
  useEffect(() => {
    if (do_id_from_url) {
      set_do_id(do_id_from_url);
    }
  }, [do_id_from_url]);

  //data fetch variable
  const [status, set_status] = useState<string>('');
  const [error, set_error] = useState<boolean>(false);
  const [content_details, set_content_details] = useState<any>(null);

  //temp variable
  const [list_temp_load, set_list_temp_load] = useState([]);
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

  useEffect(() => {
    if (error === true) {
      sessionStorage.removeItem(do_var);
      // window.open('http://localhost', '_self');
      window.close();
      console.log('############ error', error);
    }
  }, [error]);

  useEffect(() => {
    const handleDownloadPDF = async () => {
      try {
        // Dynamically import pdf-lib to reset state
        const blob = await pdf(
          <QuestionPaperPDF key={Date.now()} data={content_details} />
        ).toBlob();
        saveAs(blob, `${do_id}_question.pdf`);
        sessionStorage.removeItem(do_var);
        setTimeout(() => {
          window.close();
        }, 50);
      } catch (error) {
        console.error('PDF generation error:', error);
      }
    };
    if (content_details != null) {
      handleDownloadPDF();
    }
  }, [content_details]);

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
            let childNodes = contentObj?.childNodes;
            //console.log('childNodes', childNodes);
            let removeNodes = [];
            if (contentObj?.children) {
              for (let i = 0; i < contentObj.children.length; i++) {
                if (contentObj.children[i]?.identifier) {
                  removeNodes.push(contentObj.children[i].identifier);
                }
              }
            }
            //console.log('removeNodes', removeNodes);
            let identifiers = childNodes.filter(
              (item: any) => !removeNodes.includes(item)
            );
            //console.log('identifiers', identifiers);
            let questions = [];
            const chunks = [];
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
            if (questions.length == identifiers.length) {
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
              let file_content = {
                // result: question_result,
                content: contentObj,
              };
              //convert to question set data
              await generateQuestionSet(file_content);
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

  //common function
  const findObjectByIdentifier = (array: any, identifier: any) => {
    return array.find((item: any) => item.identifier === identifier);
  };
  const generateQuestionSet = async (file_content: any) => {
    let temp_question_set: any = {};
    temp_question_set['organization'] = 'PRATHAM EDUCATION FOUNDATION';
    temp_question_set['program'] = 'SECOND CHANCE PROGRAM';
    temp_question_set['name'] = file_content?.content?.name;
    let sections = [];
    let paperMarks = 0;
    for (let i = 0; i < file_content?.content?.children?.length; i++) {
      if (file_content?.content?.children[i]?.children?.length > 0) {
        let questions = [];
        let totalMarks = 0;
        for (
          let j = 0;
          j < file_content?.content?.children[i]?.children?.length;
          j++
        ) {
          let maxScore =
            file_content?.content?.children[i]?.children[j]?.maxScore;
          let options = file_content?.content?.children[i]?.children[
            j
          ]?.interactions?.response1?.options?.map((option: any) => {
            return {
              ...option,
              label: option.label,
            };
          });
          totalMarks += maxScore;
          questions.push({
            questionTitle:
              file_content?.content?.children[i]?.children[j]?.body,
            maxScore: maxScore,
            options: options,
          });
        }
        paperMarks += totalMarks;
        sections.push({
          sectionTitle: file_content?.content?.children[i]?.name,
          totalMarks: totalMarks,
          questions: questions,
        });
      }
    }
    temp_question_set['paperMarks'] = paperMarks;
    temp_question_set['sections'] = sections;
    //set to generate pdf
    set_content_details(temp_question_set);
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

  if (do_id == null) {
    return <div>Do ID not found</div>;
  }
  return (
    <div>
      {/* DO ID ={do_id} */}
      <br />
      {status}
      {/* <br />
      {content_details && (
        <BlobProvider
          document={
            <QuestionPaperPDF key={Date.now()} data={content_details} />
          }
        >
          {({ url, loading }) =>
            loading ? (
              <div>Loading PDF...</div>
            ) : (
              <iframe
                src={url}
                width="100%"
                height="600px"
                title="PDF Preview"
              />
            )
          }
        </BlobProvider>
      )}
      <br />
      <pre>{JSON.stringify(content_details, null, 2)}</pre> */}
    </div>
  );
}
