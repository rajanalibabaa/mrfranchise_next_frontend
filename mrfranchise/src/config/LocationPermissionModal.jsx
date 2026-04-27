import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const LocationPermissionModal = ({ open, onAllow, onDeny }) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Allow Location Access</DialogTitle>

      <DialogContent>
        <Typography variant="body2">
          We use your location to show relevant states and improve your experience.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onDeny} color="inherit">
          Not Now
        </Button>

        <Button onClick={onAllow} variant="contained">
          Allow
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPermissionModal;