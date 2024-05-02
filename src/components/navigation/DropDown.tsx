import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { Avatar, Box, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserModel } from "@/models/User";
import { AuthCtx } from "@/context/AuthContext";

export default function MenuListComposition() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const [user, setUser] = useState<UserModel | null>(null);
  const { getSession } = useContext(AuthCtx);

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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row">
      <Box>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <MenuIcon></MenuIcon>
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-end"
          transition
          disablePortal
          sx={{ zIndex: 5 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    disablePadding
                  >
                    {user && user.picture ? (
                      <Box>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/");
                          }}
                        >
                          Home
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/compare");
                          }}
                        >
                          Compare
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/api/auth/signout");
                          }}
                        >
                          <Avatar
                            src={user.picture}
                            alt="User picture"
                            sx={{ width: 24, height: 24, marginRight: 2 }} // Adjust size as needed
                            onClick={handleToggle}
                            aria-controls={
                              open ? "composition-menu" : undefined
                            }
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                          />
                          Sign Out
                        </MenuItem>
                      </Box>
                    ) : (
                      <Box>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/");
                          }}
                        >
                          Home
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/compare");
                          }}
                        >
                          Compare
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/api/auth/signin");
                          }}
                        >
                          Sign In / Sign Up
                        </MenuItem>
                      </Box>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Stack>
  );
}
