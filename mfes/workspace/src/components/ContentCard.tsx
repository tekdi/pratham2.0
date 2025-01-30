import {
  Box,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import React from "react";

interface ContentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <>
      <Box>
        <Card
          variant="outlined"
          sx={{
            minWidth: 200,
            maxWidth: 200,
            minHeight: 100,
            maxHeight: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-5px)",
              transition: "transform 0.3s ease-in-out",
            },
          }}
          onClick={onClick}
        >
          <CardContent>
            <Box display={"flex"} gap="1rem">
              {icon}
              <Typography component="div">{title}</Typography>
            </Box>
          </CardContent>
          {/* <CardActions>
            <Button size="small">{`Create ${title}`}</Button>
          </CardActions> */}
        </Card>
        <Box marginTop={"1rem"} sx={{ minWidth: 200, maxWidth: 200 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            justifyContent={"center"}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ContentCard;
