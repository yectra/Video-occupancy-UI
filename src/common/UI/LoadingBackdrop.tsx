// React Dependancies
import React from 'react';

import { Backdrop, CircularProgress } from '@mui/material';
interface IProps {
  isLoading: boolean;
}

const LoadingBackdrop: React.FC<IProps> = ({ isLoading }) => {
  return (
    <Backdrop open={isLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress sx={{color:"#005DE9"}} />
    </Backdrop>
  );
};

export default LoadingBackdrop;