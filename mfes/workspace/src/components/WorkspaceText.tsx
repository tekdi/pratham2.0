import { Box, Typography, useTheme } from "@mui/material"
import React from "react";


const WorkspaceText: React.FC<any> = () => {
    const theme = useTheme<any>();

    return (<Box p={3} display={"flex"} sx={{
        flexDirection: 'row',
        alignItems: 'center',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        '@media (max-width: 900px)': { padding: '18px 24px' }
    }} gap={2}>
        <Typography
            variant="h1"
            sx={{
                color: theme.palette.warning['300'],
                marginRight: "10px",
                fontSize: "22px",
                fontWeight: 400,
                '@media (max-width: 900px)': { paddingLeft: '34px' }
            }}
        >
            Workspace
        </Typography>

        <Typography
            variant="body1"
            color="#635E57"
            width={'70%'}

            fontSize={15}
            sx={{
                lineHeight: '20px', fontSize: '14px', '@media (max-width: 768px)': {
                    width: '100%'
                }
            }}
        >
            Create, organize, and manage all types of content in one place.
            Whether it&apos;s courses, assessments, or any other type of content.
        </Typography>
    </Box>)
}

export default WorkspaceText;