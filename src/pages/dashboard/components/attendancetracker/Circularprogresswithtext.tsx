import React from "react";

import styled from "styled-components";

import { CircularProgress } from "@mui/material";

import { CircularProgressWithTextProps } from "@/pages/dashboard/models/attendancetracker/index";

const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

const CircularProgressStyled = styled(CircularProgress)`
  svg {
    transform: rotate(0deg);
  }
`;

const CircularBg = styled(CircularProgressStyled)`
  position: absolute;
`;

const CircularFg = styled(CircularProgressStyled)``;

const CenteredText = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 28px;
  font-weight: bold;
  color: #1c214f;
`;

const CircularProgressWithText: React.FC<CircularProgressWithTextProps> = ({
  value,
  text,
  ...props
}) => {
  const progressValue = (value / 12) * 100;

  return (
    <Container>
      <CircularBg variant="determinate" value={progressValue} {...props} />
      <CircularFg variant="determinate" value={progressValue} {...props} />
      <CenteredText>{text}</CenteredText>
    </Container>
  );
};

export default CircularProgressWithText;
