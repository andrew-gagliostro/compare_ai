import React from "react";
import Tooltip from "@mui/material/Tooltip";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// Function to determine color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "yellow";
    case "Parsed":
      return "green";
    case "Failed To Parse":
      return "red";
    default:
      return "grey";
  }
};

interface StatusIndicatorProps {
  status: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  return (
    <Tooltip title={status} placement="top" arrow>
      <FiberManualRecordIcon
        sx={{
          color: getStatusColor(status),
          verticalAlign: "middle",
          fontSize: "1rem", // Adjust size as needed
        }}
      />
    </Tooltip>
  );
};

export default StatusIndicator;
