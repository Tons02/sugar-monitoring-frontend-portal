import React from "react";
import { Typography, Box } from "@mui/material";
import AccessDenied from "../../assets/validations/403.png";

const AccessPermissionContext = ({ permission, children }) => {
  const storedData = JSON.parse(localStorage.getItem("user"));
  const { role } = storedData;

  const accessPermissions = Array.isArray(role.access_permission)
    ? role.access_permission.map((item) => item.trim())
    : [];

  if (!accessPermissions?.includes(permission)) {
    
    console.log('you dont have permission');
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          flex: 1,
        }}
      >
        <img src={AccessDenied} style={{ width: 500, height: "auto" }} />
      </Box>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AccessPermissionContext;