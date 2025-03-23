import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { fetchQuestion } from '@/services/ObservationServices';
import { UserList } from './UserCard';
import { VolunteerField } from '../../utils/app.constant';
import { Download } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

type Participant = {
  name: string;
  age: number;
  gender: string;
};

interface EntryContentProps {
  entityId: string;
  questionResponse?: any;
  setQuestionResponseResponse?: (data: any) => void;
  observationId?: any;
  submissionNumber?: any;
}

const EntryContent: React.FC<EntryContentProps> = ({
  entityId,
  questionResponse,
  setQuestionResponseResponse,
  observationId,
  submissionNumber,
}) => {
  const router = useRouter();
  const [submittedBy, setSubmittedBy] = useState<string>("");
  const [submittedByName, setSubmittedByName] = useState<string>("");
  const [submissionDate, setSubmissionDate] = useState<string>("");

  useEffect(() => {
    const fetchQuestionsList = async () => {
      try {
        if (observationId && entityId) {
          const response = await fetchQuestion({
            observationId: observationId.toString(),
            entityId: entityId.toString(),
            ...(submissionNumber && { tempSubmissionNumber: submissionNumber }),
          });

          const combinedData = {
            solution: response.solution,
            assessment: { ...response.assessment },
          };

          setQuestionResponseResponse?.(mapBackendDataToQAPairs(combinedData?.assessment?.submissions));
          setSubmittedByName(combinedData?.assessment?.submissions?.OB?.submittedByName || "");
          setSubmittedBy(combinedData?.assessment?.submissions?.OB?.submittedBy || "");
          setSubmissionDate(combinedData?.assessment?.submissions?.OB?.submissionDate || "");
        }
      } catch (error) {
        console.error("Error fetching data", error);
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

        if (answer.payload?.labels?.length > 0) {
            value = answer.payload.labels[0];
        }

        // Handle file uploads separately
        if (Array.isArray(answer.fileName) && answer.fileName.length > 0) {
            const fileUrls = answer.fileName.map((file: any) => file.previewUrl);
            result.push({ question, answer: fileUrls });
            return; // Prevents further processing of file-type responses
        }

        if (["multiselect", "radio", "text", "number"].includes(responseType)) {
            result.push({ question, answer: value });
        }

        // Handle Matrix Responses for Participants
        if (responseType === "matrix" && Array.isArray(answer.value)) {
            answer.value.forEach((participantData: any) => {
                let participant: any = { name: "", age: 0, gender: "" };

                Object.values(participantData).forEach((subQ: any) => {
                    const subQuestion = subQ.payload?.question?.[0];
                    let subValue = subQ.value;

                    if (subQ.payload?.labels?.length > 0) {
                        subValue = subQ.payload.labels[0];
                    }

                    if (subQuestion === "Participant Name") participant.name = subValue;
                    if (subQuestion === "Age") participant.age = Number(subValue);  // Ensure Age is a number
                    if (subQuestion === "Gender") participant.gender = String(subValue);  // Ensure Gender is a string
                });

                if (participant.name) {
                    participants.push(participant);
                }
            });
        }
    });

    if (participants.length > 0) {
        result.push({ question: "Participant Name", answer: participants }); // Changed back to "Participant Name"
    }

    return result;
};





  const onUserClick = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No submission date available";
    const date = new Date(dateString);
    return `Submitted on ${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} @ ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
  };

  const handleFileDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "12px", fontWeight: "300", fontStyle: "italic" }}>
        {formatDate(submissionDate)}
      </Typography>
      <UserList
        users={[
          { Id: submittedBy, name: submittedByName, firstName: submittedByName, isVolunteer: VolunteerField.YES },
        ]}
        onUserClick={onUserClick}
      />
      <Divider />
      <Box>
        {questionResponse?.map((pair: any, index: number) => (
          <Box key={index} sx={{ marginTop: "20px" }}>
            <Typography sx={{ fontSize: "14px", fontWeight: "500", color: "black" }}>
              {pair?.question}
            </Typography>

            <Box sx={{ marginTop: "8px" }}>
              {pair?.question === "Participant Name" && Array.isArray(pair.answer) ? (
                <Box sx={{ background: "#FAF3E0", padding: "10px", borderRadius: "8px" }}>
                  {pair.answer.map((participant: Participant, idx: number) => (
                    <Box key={idx} sx={{ padding: "8px 0", borderBottom: idx !== pair.answer.length - 1 ? "1px solid #ddd" : "none" }}>
                      <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
                        {participant.name.charAt(0).toUpperCase() + participant.name.slice(1)}
                      </Typography>
                      <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#555" }}>
                        {participant.age} y/o • {participant.gender}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : Array.isArray(pair.answer) ? (
                pair.answer.map((fileUrl: string, idx: number) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", background: "#fff", padding: "10px", borderRadius: "12px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", maxWidth: "350px", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <InsertDriveFileIcon sx={{ color: "#555" }} />
                      <Typography sx={{ fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }} title={`File ${idx + 1}`}>
                        File {idx + 1}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => handleFileDownload(fileUrl)} sx={{ color: "black" }}>
                      <Download />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>{pair.answer}</Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default EntryContent;
