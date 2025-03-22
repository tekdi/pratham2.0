import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { fetchQuestion } from '@/services/ObservationServices';
import { UserList } from './UserCard';
import { VolunteerField } from '../../utils/app.constant';

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
  observationId?: any
}
const EntryContent: React.FC<EntryContentProps> = ({   entityId , questionResponse,  setQuestionResponseResponse, observationId }: any) => {
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
          const response=await fetchQuestion({observationId:observationId.toString(),entityId})
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
  }, [entityId, observationId]);
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

        if (responseType === "multiselect" || responseType === "radio" || responseType === "text" || responseType === "number") {
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
        result.push({ question: "Participant Name", answer: participants });
    }

    // console.log(result);

    console.log("########### result",result)
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
      {questionResponse?.map((pair: any, index: any) => (
        <Box key={index} sx={{ marginTop: '20px' }}>
          <Typography
            sx={{ fontSize: '14px', fontWeight: '500', color: 'black' }}
          >
            {pair?.question}
          </Typography>
          <Box sx={{ marginTop: '8px' }}>
            {/* Custom UI for "Participant Name" */}
            {pair?.question === 'Participant Name' && Array.isArray(pair.answer) ? (
              <Box sx={{ background: '#FAF3E0', padding: '10px', borderRadius: '8px' }}>
                {pair.answer.map((participant: Participant, idx: number) => (
                  <Box key={idx} sx={{ padding: '8px 0', borderBottom: idx !== pair.answer.length - 1 ? '1px solid #ddd' : 'none' }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                      {participant?.name?.charAt(0).toUpperCase() + participant?.name.slice(1)}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '400', color: '#555' }}>
                      {participant.age} y/o • {participant.gender}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              pair.answer
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EntryContent;
