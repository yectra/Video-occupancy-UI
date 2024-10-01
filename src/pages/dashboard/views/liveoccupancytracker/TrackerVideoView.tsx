import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Box,
  Modal,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VideoPlayer } from "@/pages/dashboard/components/liveoccupancytracker/VideoPlayer";
import { useLocation, useNavigate } from "react-router-dom";
import { BackendPayload } from "@/pages/dashboard/models/liveoccupanytracker";
import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

interface CameraSetup {
  entranceName: string;
  cameraPosition: string;
  videoSource: string;
}

interface Coordinates {
  [key: string]: number[][];
}

const TrackerVideoView: React.FC = () => {
  const [fullScreenVideo, setFullScreenVideo] = useState<string | null>(null);
  const [settingCoordinates, setSettingCoordinates] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoSources, setVideoSources] = useState<CameraSetup[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates>({});
  const [capacityOfPeople, setCapacityOfPeople] = useState<number>(50);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  const occupancyTracker = new OccupancyTracker();

  useEffect(() => {
    if (location.state && location.state.cameraSetups) {
      console.log(location.state)
      setAlertMessage(location.state.alertMessage)
      setVideoSources(location.state.cameraSetups);
      setCapacityOfPeople(location.state.capacity)
      const initialCoordinates: Coordinates = {};
      location.state.cameraSetups.forEach((camera: CameraSetup) => {
        initialCoordinates[camera.videoSource] = [];
      });
      setCoordinates(initialCoordinates);
    }
  }, [location.state]);

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
    setSettingCoordinates(!settingCoordinates);
  };

  const handleCoordinateCapture = (
    source: string,
    newCoordinates: number[][] 
  ) => {
    setCoordinates((prevCoordinates) => ({
      ...prevCoordinates,
      [source]: newCoordinates,
    }));
  };

  const handleFinish = () => {
    const payload: BackendPayload = {
      capacityOfPeople: capacityOfPeople,
      alertMessage: alertMessage,
      cameraDetails: videoSources.map((camera) => ({
        entranceName: camera.entranceName,
        cameraPosition: camera.cameraPosition.toLowerCase(),
        videoUrl: camera.videoSource,
        doorCoordinates: coordinates[camera.videoSource] || [],
      })),
    };  

    occupancyTracker.addSetupDetails(payload).then((response) => {
      console.log(response);
    });
    console.log("Payload to send to backend:", payload);

    navigate("/dashboard/occupancy-tracker/overview");
  };

  const handleBackClick = () => {
    navigate("/dashboard/occupancy-tracker", {
      state: {
        cameraSetups: videoSources,
        alertMessage,
        capacity: capacityOfPeople,
        coordinates,
        step: 1
      }
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="h4"
          align="center"
          gutterBottom
        >
          Preview Details
        </Typography>
      </Grid>

      {videoSources.map((video, index) => (
        <Grid item xs={4} key={index}>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontWeight: "bold", color: "#1C214F" }}
                variant="h6"
                align="center"
                gutterBottom
              >
                {video.entranceName}
              </Typography>
              <VideoPlayer
                source={video.videoSource}
                onClick={() => handleVideoClick(video.videoSource)}
                settingCoordinates={settingCoordinates}
                onCoordinateCapture={(newCoordinates) =>
                  handleCoordinateCapture(video.videoSource, newCoordinates)
                }
                coordinates={coordinates[video.videoSource] || []}
                fullscreen={fullScreenVideo === video.videoSource}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Box sx={{ display: "flex",justifyContent:"space-between" }}>
          <Button
            sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" } }}
            variant="contained"
            onClick={handleSetCoordinates}
          >
            {settingCoordinates
              ? "Stop Setting Coordinates"
              : "Set Coordinates"}
          </Button>
          <Button
            sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" } }}
            variant="contained"
            onClick={handleFinish}
          >
            Finish
          </Button>
        </Box>
      </Grid>

      {fullScreenVideo && (
        <Modal open={true} onClose={handleCloseModal}>
          <Box
            sx={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              height: "90%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              position: "absolute", 
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{bgcolor:"#00D1A3"}}
              >
                Save
              </Button>
            </Box>

            <VideoPlayer
              source={fullScreenVideo}
              fullscreen={true}
              settingCoordinates={
                settingCoordinates && selectedVideo === fullScreenVideo
              }
              onCoordinateCapture={(newCoordinates: number[][]) =>
                handleCoordinateCapture(fullScreenVideo, newCoordinates)
              }
              coordinates={coordinates[fullScreenVideo] || []}
            />
          </Box>
        </Modal>
      )}
    </Grid>
  );
};

export default TrackerVideoView;