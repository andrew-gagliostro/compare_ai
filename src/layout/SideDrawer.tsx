/* eslint-disable eqeqeq */
import React, { useState, useEffect, useContext } from "react";
import MuiDrawer from "@mui/material/Drawer";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import SvgIcon, { SvgIconProps, SvgIconTypeMap } from "@mui/material/SvgIcon";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LinkIcon from "@mui/icons-material/Link";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Avatar,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { AccountCircle, VerifiedUser } from "@mui/icons-material";
import { useRouter } from "next/router";
import Image from "next/image";
import { AuthCtx } from "@/context/AuthContext";
import { UserModel } from "@/models/User";

interface NavOption {
  label: string;
  path: string;
  icon: OverridableComponent<SvgIconTypeMap>;
}

// const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: "200px",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: "200px",
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  zIndex: 1,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const dividerStyle = {
  borderColor: "rgba(255, 255, 255, .1)",
};

interface UserAvatarIconProps extends SvgIconProps {
  userPictureUrl: string;
}

// eslint-disable-next-line react/display-name
const UserAvatarIcon = React.forwardRef<SVGSVGElement, UserAvatarIconProps>(
  ({ userPictureUrl, ...props }, ref) => (
    // Apply the rest of the props to SvgIcon and include the custom user picture
    <SvgIcon {...props} ref={ref}>
      <image href={userPictureUrl} height="100%" width="100%" />
    </SvgIcon>
  )
);

const SideDrawer = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [NavOptions, setNavOptions] = useState<NavOption[]>([]);
  const { getSession } = useContext(AuthCtx);
  const [user, setUser] = useState<UserModel | null>(null);

  let session = getSession();

  useEffect(() => {
    const updateUser = () => {
      try {
        session = getSession();

        if (!session || !session.user) {
          setUser(null);
        } else {
          console.log("session.user", session.user);
          setUser(session.user as UserModel);
        }
      } catch {
        setUser(null);
      }
    };
    updateUser();

    // we are not using async to wait for updateUser, so there will be a flash of page where the user is assumed not to be logged in. If we use a flag
    // check manually the first time because we won't get a Hub event // cleanup
  }, [session]);

  useEffect(() => {
    async function hasAdminAccess() {
      if (user) {
        setNavOptions([
          {
            label: "Home",
            path: "/",
            icon: DashboardIcon,
          },
          {
            label: "Compare",
            path: "/compare",
            icon: AdminPanelSettingsIcon,
          },
          {
            label: "Sign Out",
            path: "/api/auth/signout",
            icon: AccountCircle,
          },
        ]);
      } else {
        setNavOptions([
          {
            label: "Home",
            path: "/",
            icon: DashboardIcon,
          },
          {
            label: "Compare",
            path: "/compare",
            icon: PermMediaIcon,
          },
          {
            label: "Sign In / Sign Up",
            path: "/api/auth/signin",
            icon: VerifiedUser,
          },
        ]);
      }
    }
    hasAdminAccess();
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined" && window?.innerWidth <= 1000)
      setOpen(false);
  }, []);

  return (
    <Drawer
      variant="permanent"
      color="black"
      open={open}
      sx={{ maxWidth: "200px", backgroundColor: "black" }}
    >
      <Box
        sx={{
          display: "flex",
          maxWidth: "200px",
          flexDirection: "column",
          height: "100vh",
          borderRight: "1px solid #333333",
        }}
      >
        <Box
          sx={{
            p: 1,
            my: 2,
            ml: open ? 0.5 : "auto",
            mr: open ? 0 : "auto",
            display: "flex",
            justifyContent: "flex-start",
            height: "max-content",
          }}
          onClick={() => {
            router.push("/");
          }}
        >
          {open && (
            <Box
              sx={{
                fontSize: 24,
                ml: 1,
                fontWeight: "bold",
                height: "100%",
                alignItems: "center",
                color: "#999",
                display: "flex",
              }}
            >
              Compared
            </Box>
          )}
        </Box>
        <Box sx={{ width: "100%" }}>
          <nav>
            <List>
              {NavOptions.map((option) => (
                <ListItem
                  key={option.label}
                  disablePadding
                  disableGutters
                  selected={router.asPath === option.path}
                  sx={{
                    "&.Mui-selected": {
                      background: "inherent",
                      borderLeft: (theme) =>
                        `2px solid ${theme.palette.primary.main}`,
                      margin: "auto",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => router.push(option.path)}
                    sx={{
                      pl: 0.5,
                      justifyContent: "left",
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip title={option.label} placement="right">
                        <option.icon
                          sx={{
                            justifyContent: "left",
                            width: "30px",
                            height: "30px",
                            ml: open ? 1 : "auto",
                            mr: open ? 1 : "auto",
                            padding: 0,
                            opacity:
                              router.asPath === option.path ? "90%" : "100%",
                            color:
                              router.asPath === option.path ? "black" : "#999",
                            background:
                              router.asPath === option.path
                                ? "radial-gradient(228.97% 175.95% at 76.22% 137.81%, #FFFFFF 0%, #41FFD6 34%, #2DAEFF 70%, #5C89FF 100%)"
                                : null,
                          }}
                        />
                      </Tooltip>
                      {open && (
                        <ListItemText
                          primary={option.label}
                          sx={{
                            ml: 2,
                            fontSize: 14,
                            alignSelf: "left",
                            color:
                              router.asPath === option.path ? "#fff" : "#999",
                          }}
                        />
                      )}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </nav>
        </Box>
        <Divider sx={dividerStyle} />
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            disableRipple
            color="primary"
            onClick={() => setOpen(!open)}
          >
            <ChevronLeftIcon
              sx={{
                transform: `rotate(${open ? 0 : 180}deg)`,
                transition: "transform 0.5s",
              }}
            />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: 1,
            }}
          ></Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideDrawer;
