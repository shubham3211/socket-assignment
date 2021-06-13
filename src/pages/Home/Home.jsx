import React, { useCallback, useEffect, useRef, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { io } from "socket.io-client";
import { REACT_APP_BASE_URL } from "../../utils/endpoints";
import { getUserState } from "../../context/User/User";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CreateNotificationModal from "../../Components/CreateNotificationModal";
import { setSuccessNotificationFactory } from "../../context/Notification/Notification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const user = getUserState();
  const setSuccessNotification = setSuccessNotificationFactory();
  const userToken = user.tokens;
  const [openCreateNotificationDialog, setOpenCreateNotificationDialog] =
    useState(false);
  const socketRef = useRef();
  useEffect(() => {
    if (!userToken) {
      return;
    }
    const socket = io(REACT_APP_BASE_URL, { auth: { token: userToken } });

    socket.on("notification", (msg) => {
      toast.info(msg, {
        position: "bottom-left",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    socketRef.current = socket;
  }, [userToken]);

  const closeCreateNotificationModal = useCallback(() => {
    setOpenCreateNotificationDialog(false);
  }, []);

  const handleSubmit = useCallback(
    ({ notificationMessage, pincode }) => {
      if (!socketRef.current) {
        return;
      }
      socketRef.current.emit(
        "create notification",
        pincode,
        notificationMessage
      );
      setSuccessNotification("Notification Send Successfully");
      closeCreateNotificationModal();
    },
    [closeCreateNotificationModal, setSuccessNotification]
  );

  return (
    <Grid container>
      <Fab
        color="secondary"
        aria-label="add"
        style={{ position: "fixed", bottom: "2%", right: "2%" }}
        onClick={() => setOpenCreateNotificationDialog(true)}
      >
        <AddIcon />
      </Fab>
      {openCreateNotificationDialog && (
        <CreateNotificationModal
          open={openCreateNotificationDialog}
          handleClose={closeCreateNotificationModal}
          handleSubmit={handleSubmit}
        />
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </Grid>
  );
}

export default Home;
