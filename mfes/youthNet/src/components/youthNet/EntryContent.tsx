import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography , IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { fetchQuestion } from '@/services/ObservationServices';
import { UserList } from './UserCard';
import { VolunteerField } from '../../utils/app.constant';
import { Download } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
type Participant = {
  name: string;
  age: number;
  gender: string;
};

type QuestionAnswer = {
  question: string;
  answer: Participant[] | React.ReactNode;
};


interface EntryContentProps {
  entityId: any;
  questionResponse?: any;
  setQuestionResponseResponse?: any;
  observationId?: any;
  submissionNumber?: any
}
const EntryContent: React.FC<EntryContentProps> = ({   entityId , questionResponse,  setQuestionResponseResponse, observationId , submissionNumber}: any) => {
    const router = useRouter();
     const [submittedBy, setSubmittedBy] = useState<any>("");
     const [submittedByName, setSubmittedByName] = useState<any>("");
     const [submissionDate, setSubmissionDate] = useState<any>("");

 

  useEffect(() => {
    const fetchQuestionsList = async () => {
      try {

        if(observationId && entityId)
        {
          entityId=entityId.toString()
          //observationId=observationId.toString()
          let response;
          if(submissionNumber)
          {
            const tempSubmissionNumber=submissionNumber;
             response=await fetchQuestion({observationId:observationId.toString(),entityId, tempSubmissionNumber})

          }
          else
          response=await fetchQuestion({observationId:observationId.toString(),entityId})

          const combinedData = {
            solution: response.solution,
            assessment: {
              ...response.assessment, // Spread all properties from assessment

            }
          };
       console.log("########### combinedData?.assessment?.submissions",combinedData?.assessment?.submissions)
          setQuestionResponseResponse(
            mapBackendDataToQAPairs(combinedData?.assessment?.submissions)
          )
          setSubmittedByName(combinedData?.assessment?.submissions?.OB?.submittedByName)
          setSubmittedBy(combinedData?.assessment?.submissions?.OB?.submittedBy)
          setSubmissionDate(combinedData?.assessment?.submissions?.OB?.submissionDate)


        }
      } catch (error) {
        console.error('Error list', error);
      }
    };
    fetchQuestionsList();
  }, [entityId, observationId, submissionNumber]);
  const mapBackendDataToQAPairs = (data: any) => {
    const answers = data?.OB?.answers || {};
    const result: { question: string; answer: any }[] = [];

    let participants: any = [];

    Object.values(answers).forEach((answer: any) => {
        const question = answer.payload?.question?.[0];
        const responseType = answer.responseType;
        let value = Array.isArray(answer.value) ? answer.value[0] : answer.value;

        // Use label mapping for values if available
        if (answer.payload?.labels && answer.payload.labels.length > 0) {
            value = answer.payload.labels[0]; 
        }

        // **Dynamically handle any question that has uploaded files**
        if (Array.isArray(answer.fileName) && answer.fileName.length > 0) {
            const fileUrls = answer.fileName.map((file: any) => file.previewUrl);
            const formattedAnswer = [
                `Answer: ${value}`,
                ...fileUrls.map((url: string, index: number) => `File ${index + 1}: ${url}`)
            ];
            result.push({ question, answer: formattedAnswer });
        } 
        else if (responseType === "multiselect" || responseType === "radio" || responseType === "text" || responseType === "number") {
            result.push({ question, answer: value });
        } 
        
        // Handle Matrix Responses for Participant List
        if (responseType === "matrix" && Array.isArray(answer.value)) {
            answer.value.forEach((participantData: any) => {
                let participant: any = { name: "", age: 0, gender: "" };

                Object.values(participantData).forEach((subQ: any) => {
                    const subQuestion = subQ.payload?.question?.[0];
                    let subValue = subQ.value;

                    // Replace value with corresponding label if exists
                    if (subQ.payload?.labels && subQ.payload.labels.length > 0) {
                        subValue = subQ.payload.labels[0]; 
                    }

                    if (subQuestion === "Participant Name") participant.name = subValue;
                    if (subQuestion === "Age") participant.age = Number(subValue);
                    if (subQuestion === "Gender") participant.gender = subValue;
                });

                if (participant.name) {
                    participants.push(participant);
                }
            });
        }
    });

    // Add participant list as a single question-answer entry
    if (participants.length > 0) {
        result.push({ question: "Participant Name", answer: participants.map((p: any) => `${p.name} (Age: ${p.age}, Gender: ${p.gender})`) });
    }

    return result;
};

const onUserClick=(userId: any)=>
  {
    router.push(`/user-profile/${userId}`);

  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    // Format: "16 Mar, 2025"
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  
    // Format: "3:23 PM"
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  
    return `Submitted on ${formattedDate} @ ${formattedTime}`;
  };
  const handleFileDownload = (fileUrl: string) => {
    console.log("Downloading file from:", fileUrl);
    // You can add more logic here if needed
    window.open(fileUrl, "_blank"); // Opens file in a new tab
  };
  return (
    <Box>
      <Typography
        sx={{ fontSize: '12px', fontWeight: '300', fontStyle: 'italic' }}
      >
        {formatDate(submissionDate)}
      </Typography>
      <UserList 
     users={[
      {
        Id: submittedBy,
        name: submittedByName,
        firstName: submittedByName,
        isVolunteer: VolunteerField.YES
      }
    ]}
    onUserClick={onUserClick}
      />
      <Divider />
      <Box>
  {questionResponse?.map((pair: any, index: number) => (
    <Box key={index} sx={{ marginTop: '20px' }}>
      <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'black' }}>
        {pair?.question}
      </Typography>

      <Box sx={{ marginTop: '8px' }}>
        {Array.isArray(pair.answer) ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {pair.answer.map((item: string, idx: number) => {
              console.log(item)
              // Extract the actual file name from S3 URL
              const urlMatch = item.match(/https?:\/\/\S+/); // Extract URL
              const fileUrl = urlMatch ? urlMatch[0] : null;
              const fileNameMatch = fileUrl?.match(/([^/]+)\?/); // Extract file name before query params
              const fileName = fileNameMatch ? decodeURIComponent(fileNameMatch[1]) : `File ${idx + 1}`;

              return fileUrl ? (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    padding: '10px',
                    borderRadius: '12px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '350px',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* File Icon and Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InsertDriveFileIcon sx={{ color: '#555' }} />
                    <Typography
                      sx={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}
                      title={fileName}
                    >
                      {fileName}
                    </Typography>
                  </Box>

                  {/* Download Button (calls function instead of direct link) */}
                  <IconButton
                    onClick={() => handleFileDownload(fileUrl)}
                    sx={{ color: 'black' }}
                  >
                    <Download />
                  </IconButton>
                </Box>
              ) : (
                <Typography key={idx} sx={{ fontSize: '14px', color: '#333' }}>
                  {item}
                </Typography>
              );
            })}
          </Box>
        ) : (
          <Typography sx={{ fontSize: '14px', color: '#333' }}>
            {typeof pair.answer === 'object' ? JSON.stringify(pair.answer) : pair.answer}
          </Typography>
        )}
      </Box>
    </Box>
  ))}
</Box>




    </Box>
  );
};

export default EntryContent;
