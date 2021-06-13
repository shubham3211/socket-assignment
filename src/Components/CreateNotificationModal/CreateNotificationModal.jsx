import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";

CreateNotificationModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default function CreateNotificationModal({
  open,
  handleClose,
  handleSubmit,
}) {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [pincode, setPincode] = useState("");
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Send Notification To Other Branches
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Notification Message"
          type="text"
          fullWidth
          value={notificationMessage}
          onChange={(e) => setNotificationMessage(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Pincode"
          type="number"
          fullWidth
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit({ notificationMessage, pincode })}
          color="primary"
        >
          Create Notification
        </Button>
      </DialogActions>
    </Dialog>
  );
}
