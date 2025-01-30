import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface ReviewCommentPopupProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (comment: string) => void;
    title: string;
}

const ReviewCommentPopup: React.FC<ReviewCommentPopupProps> = ({ open, onClose, onSubmit, title }) => {
    const [comment, setComment] = useState<string>('');

    const handleSubmit = () => {
        if (comment.trim()) {
            onSubmit(comment);
            setComment('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={{ marginTop: "0.5rem" }}>
                <TextField
                    label="Write your comment"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ marginBottom: "0.5rem" }}>
                <Button
                    variant="outlined"
                    sx={{
                        color: "var(--mui-palette-warning-100) !important",
                        border: "1px solid var(--mui-palette-warning-100) !important",
                        fontSize: "14px !important",
                        fontWeight: "500 !important",
                        marginRight: 1,
                        minWidth: "120px",
                        borderRadius: "100px",
                        textTransform: "capitalize"
                    }}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ minWidth: "120px", textTransform: "capitalize" }}
                    className="Request-btn"
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewCommentPopup;
