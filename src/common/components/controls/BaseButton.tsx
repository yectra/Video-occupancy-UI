import React from "react";
import { Button, ButtonProps } from "@mui/material";

const BaseButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};

export default BaseButton;