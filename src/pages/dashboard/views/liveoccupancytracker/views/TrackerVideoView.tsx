import React, { useState } from 'react';
import { Button, Grid, Typography, Box, Modal, Card, CardContent } from '@mui/material';
import VideoPlayer from '@/pages/dashboard/components/liveoccupancytracker/VideoPlayer';
import vidOne from '@/assets/cam_1.mp4';
import vidTwo from '@/assets/cam_2.mp4';
import vidThree from '@/assets/cam_3.mp4';
import vidFour from '@/assets/cam_4.mp4';

const TrackerVideoView: React.FC = () => {
  const [fullScreenVideo, setFullScreenVideo] = useState<string | null>(null);
  const [settingCoordinates, setSettingCoordinates] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videoSources = [
    { source: vidOne, label: 'Location 1' },
    { source: vidTwo, label: 'Location 2' },
    { source: vidThree, label: 'Location 3' },
    { source: vidFour, label: 'Location 4' },
    { source: vidOne, label: 'Location 5' },
    { source: vidTwo, label: 'Location 6' },
  ];

  const handleVideoClick = (source: string) => {
    if (settingCoordinates) {
      setSelectedVideo(source);
      setFullScreenVideo(source);
    } else {
      setFullScreenVideo(source);
    }
  };

  const handleCloseModal = () => {
    setFullScreenVideo(null);
    if (settingCoordinates) {
      setSettingCoordinates(false);
      setSelectedVideo(null);
    }
  };

  const handleSetCoordinates = () => {
    setSettingCoordinates(true);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography sx={{ fontWeight: "bold" }} variant="h4" align="center" gutterBottom>
          Preview Details
        </Typography>
      </Grid>
      
      {videoSources.map((video, index) => (
        <Grid item xs={4} key={index}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: "bold", color: "#1C214F" }} variant="h6" align="center" gutterBottom>
                {video.label}
              </Typography>
              <VideoPlayer 
                source={video.source} 
                onClick={() => handleVideoClick(video.source)} 
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
      
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button 
            sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" } }} 
            variant="contained"
            onClick={handleSetCoordinates}
          >
            Set coordinates
          </Button>
          <Button sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" } }} variant="contained">
            Finish
          </Button>
        </Box>
      </Grid>
      
      {fullScreenVideo && (
        <Modal open={true} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              height: '90%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <VideoPlayer 
              source={fullScreenVideo} 
              fullscreen={true} 
              settingCoordinates={settingCoordinates && selectedVideo === fullScreenVideo}
            />
          </Box>
        </Modal>
      )}
    </Grid>
  );
};

export default TrackerVideoView;
