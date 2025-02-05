import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
interface ActionCellProps {
  rowData: any;
  onEdit: (rowData: any) => void; //NOSONAR
  onDelete: (rowData: any) => void; //NOSONAR
  extraActions: {
    name: string;
    onClick: (rowData: any) => void;
    icon: React.ElementType;
  }[];

  showIcons?: boolean;
}

const ActionCell: React.FC<ActionCellProps> = ({
  rowData,
  extraActions,
  showIcons = true,
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      {extraActions?.length > 0 ? (
        <Box>
          <IconButton size="small" onClick={handleClick} role="button">
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {extraActions?.map((action, index) => (
              <Box key={action?.name}>
                <Divider />
                <MenuItem
                  sx={{ fontSize: "small" }}
                  onClick={() => {
                    action.onClick(rowData);
                    handleClose();
                  }}
                >
                  {showIcons ? (
                    <ListItemIcon>
                      <action.icon fontSize="small" />
                    </ListItemIcon>
                  ) : (
                    ""
                  )}
                  <ListItemText primary={t(action?.name)} />
                </MenuItem>
              </Box>
            ))}
          </Menu>
        </Box>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default ActionCell;
