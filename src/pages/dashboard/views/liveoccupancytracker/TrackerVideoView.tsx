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
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VideoPlayer } from "@/pages/dashboard/components/liveoccupancytracker/VideoPlayer";
import { useLocation, useNavigate } from "react-router-dom";

//Models
import { BackendPayload } from "@/pages/dashboard/models/liveoccupanytracker";

//Services
import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

interface CameraSetup {
  entranceName: string;
  cameraPosition: string;
  videoSource: string;
  doorCoordinates?: number[][];
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
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
    } else if (location.state && location.state.cameraResponse) {
      const formattedData: CameraSetup[] = location.state.cameraResponse.cameraDetails.map((camera: any) => ({
        entranceName: camera.entranceName,
        cameraPosition: camera.cameraPosition,
        videoSource: camera.videoUrl,
        doorCoordinates: camera.doorCoordinates,
      }));
      setVideoSources(formattedData);
      const initialCoordinates: Coordinates = {};
      formattedData.forEach((camera: CameraSetup) => {
        initialCoordinates[camera.videoSource] = camera.doorCoordinates ?? [];
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
    setLoading(true);
    if (location.state && location.state.cameraSetups) {
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
        setSnackbarMessage('Setup Details added successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        if (response)
          navigate("/dashboard/occupancy-tracker/overview", {
            state: {
              videoSources,
              alertMessage,
              capacityOfPeople,
              coordinates,
            },
          });
      }).catch((error) => {
        setSnackbarMessage(error.response.data.warn);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      })
        .finally(() => setLoading(false));
    } else if (location.state && location.state.cameraResponse) {
      const payload: BackendPayload = {
        capacityOfPeople: location.state.cameraResponse.capacityOfPeople,
        alertMessage: location.state.cameraResponse.alertMessage,
        cameraDetails: videoSources.map((camera) => ({
          entranceName: camera.entranceName,
          cameraPosition: camera.cameraPosition.toLowerCase(),
          videoUrl: camera.videoSource,
          doorCoordinates: coordinates[camera.videoSource] || [],
        })),
      };
      navigate("/dashboard/occupancy-tracker/tracker-setup", {
        state: {
          payload
        },
      });
    }
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

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>
      <Grid item xs={12}>
        {location.state && location.state.cameraSetups && <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>}
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
        <Grid item xs={12} sm={6} md={4} key={index}>
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
        <Box sx={{ display: "flex" }}>
          <Button
            sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" } }}
            variant="contained"
            onClick={handleSetCoordinates}
          >
            <Typography>{settingCoordinates
              ? "Stop Setting Coordinates"
              : "Set Coordinates"}</Typography>
          </Button>
          <Button
            sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" }, marginLeft: 5, minWidth: "200px" }}
            variant="contained"
            onClick={handleFinish}
          >
            <Typography>Finish</Typography>
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
              maxWidth: "100%",
              maxHeight: "100%"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ bgcolor: "#00D1A3" }}
              >
                <Typography>Save</Typography>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default TrackerVideoView;
