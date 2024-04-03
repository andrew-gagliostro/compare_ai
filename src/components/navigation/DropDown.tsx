// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/router";
// import {
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Box,
//   Paper,
//   Button,
//   Typography,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";

// // Define a type for the menu items, with label and route properties
// type MenuItem = {
//   label: string;
//   route: string;
// };

// // Define a type for the props accepted by the AppMenu component
// type AppMenuProps = {
//   menuItems: MenuItem[];
// };

// const AppMenu: React.FC<AppMenuProps> = ({ menuItems }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [buttonPosition, setButtonPosition] = useState<DOMRect | undefined>();
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (buttonRef.current) {
//       setButtonPosition(buttonRef.current.getBoundingClientRect());
//     }
//   }, [buttonRef]);

//   const toggleDrawer = (state: boolean) => {
//     setIsOpen(state);
//   };

//   const handleItemClick = (path: string) => {
//     router.push(path);
//     setIsOpen(false); // Close drawer after navigation
//   };

//   const drawerWidth = 250;

//   return (
//     <Box>
// <IconButton ref={buttonRef} onClick={() => toggleDrawer(true)}>
//   <MenuIcon />
// </IconButton>
//       <Drawer
//         anchor="left"
//         open={isOpen}
//         onClose={() => toggleDrawer(false)}
//         ModalProps={{ BackdropProps: { invisible: true } }}
//         // Add style to position the Paper below the IconButton
//         PaperProps={{
//           style: {
//             position: "absolute",
//             top: buttonPosition?.bottom ?? "auto",
//             right: buttonPosition
//               ? `calc(100vw - ${buttonPosition.right}px`
//               : "auto",
//             width: drawerWidth,
//             height: "fit-content",
//             borderRadius: 5,
//           },
//         }}
//       >
//         {/* Paper component contains the list items */}
//         <Paper sx={{ width: 250 }} elevation={4}>
//           <Box className="navmenu" sx={{ fontWeight: "bold" }}>
//             <List>
//               {menuItems.map((item, index) => (
//                 <ListItem
//                   button
//                   key={index}
//                   onClick={() => handleItemClick(item.route)}
//                 >
//                   <Typography sx={{ fontWeight: "bolder" }}>
//                     {item.label}
//                   </Typography>
//                 </ListItem>
//               ))}
//             </List>
//           </Box>
//         </Paper>
//       </Drawer>
//     </Box>
//   );
// };

// export default AppMenu;

import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { Box, Menu } from "@mui/material";
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
    <Stack direction="row" spacing={2}>
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
                  >
                    {user ? (
                      <>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/api/auth/signout");
                          }}
                        >
                          Logout
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem
                          onClick={() => {
                            handleClose;
                            router.push("/api/auth/signin");
                          }}
                        >
                          Sign In / Sign Up
                        </MenuItem>
                      </>
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
