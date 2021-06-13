import React, { useEffect, useState } from "react";
import {
  Toolbar,
  Typography,
  AppBar,
  useTheme,
  Box,
  Backdrop,
} from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import IconButton from "@material-ui/core/IconButton";
import {
  getLoaderState,
  spinLoaderFactory,
  stopLoaderFactory,
} from "../../context/Loader/Loader";
import { getUserState } from "../../context/User/User";
import {
  getNotificationState,
  getNotificationTypes,
  removeNotificationFactory,
} from "../../context/Notification/Notification";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { isEmpty } from "../../utils";
import { paths } from "../../utils/appPaths";
import { useHistory } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import api from "../../utils/axios";
import {
  USER_NOTIFICATIONS_PATH,
  USER_NOTIFICATIONS_UPDATE_PATH,
} from "../../utils/endpoints";

function Loader() {
  const loaderState = getLoaderState();
  if (!loaderState) {
    return null;
  }
  return (
    <Backdrop open={true}>
      <Box position="fixed">
        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={40}
          thickness={4}
        />
      </Box>
    </Backdrop>
  );
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const ITEM_HEIGHT = 48;

const NotificationMenu = () => {
  const theme = useTheme();
  const userState = getUserState();
  const userToken = userState.tokens;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [userNotifications, setUserNotifications] = useState([]);
  const spinLoader = spinLoaderFactory();
  const stopLoader = stopLoaderFactory();
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (open && userToken) {
      spinLoader();
      setUserNotifications([]);
      api
        .get(USER_NOTIFICATIONS_PATH, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((data) => {
          setUserNotifications(data.data.userNotifications);
        })
        .finally(() => {
          stopLoader();
        });
    }
  }, [open, userToken]);

  const markNotificatioAsRead = (userNotificationId) => {
    spinLoader();
    api
      .put(
        `${USER_NOTIFICATIONS_UPDATE_PATH}/${userNotificationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      )
      .then(() => {
        setUserNotifications((userNotifications) =>
          userNotifications.map((userNotification) => ({
            ...userNotification,
            read:
              userNotification._id == userNotificationId ||
              userNotification.read,
          }))
        );
      })
      .finally(() => {
        stopLoader();
      });
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        {!isEmpty(userState) && (
          <NotificationsActiveIcon
            style={{ color: theme.palette.background.paper }}
          />
        )}
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 10,
            width: "50ch",
          },
        }}
      >
        {userNotifications.map((userNotification) => (
          <MenuItem
            key={userNotification._id}
            onClick={() => {
              markNotificatioAsRead(userNotification._id);
            }}
            selected={userNotification.read}
          >
            {userNotification.notification.content}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const Notification = () => {
  const notificationState = getNotificationState();
  const NOTIFICATION_TYPES = getNotificationTypes();
  const removeNotification = removeNotificationFactory();
  if (!notificationState.notification) {
    return null;
  }
  return (
    <Snackbar
      open={true}
      autoHideDuration={6000}
      onClose={() => {
        removeNotification();
      }}
    >
      <Alert
        severity={
          notificationState.notificationType == NOTIFICATION_TYPES.SUCCESS
            ? "success"
            : "error"
        }
      >
        {notificationState.notification}
      </Alert>
    </Snackbar>
  );
};

function Navbar() {
  const userState = getUserState();
  const history = useHistory();
  if (isEmpty(userState)) {
    history.push(paths.LOGIN);
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6">
            Branch Manage {userState.user && `- ${userState.user.username}`}
          </Typography>
          <NotificationMenu />
        </Toolbar>
      </AppBar>
      <Loader />
      <Notification />
    </>
  );
}

export default Navbar;
