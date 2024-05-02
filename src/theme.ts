import { createTheme, responsiveFontSizes } from "@mui/material";

export const primary = "#7a808d";
export const secondary = "#857D9E";

const theme = createTheme({
  palette: {
    background: {
      paper: "#fff",
      default: "#0d1218",
    },
    primary: {
      main: primary,
      contrastText: "#fff",
    },
    secondary: {
      main: secondary,
      contrastText: "#fff",
    },
    error: {
      main: "#f44336",
      contrastText: "#fff",
    },
    divider: "#857D9E",
  },
  typography: {
    fontFamily: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji",
    ].join(","),
    h1: {
      fontSize: "4rem",
      fontWeight: 700,
      lineHeight: 1,
      color: "#fff",
    },
    h2: {
      letterSpacing: "-.025em",
      fontWeight: 700,
      fontSize: "2.25rem",
      color: "#fff",
    },
    h3: {
      color: "#fff",
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.75,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.75,
      color: "#d1d5db",
    },
    body2: {
      fontSize: "1rem",
      lineHeight: 1.75,
      color: "#9CA3AF",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        // Set global default props for TextField here
        InputLabelProps: {
          style: {
            color: "#757575", // Your specific contrast color
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: secondary,
          color: "#fff",
          gap: 1,
        },
      },
    },
    MuiMenuList: {
      styleOverrides: {
        root: {
          zIndex: 1000,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: secondary,
          fontWeight: 550,
          backgroundColor: "#f6f6f6",
          "&:hover": {
            backgroundColor: "#dddddd",
          },
          borderRadius: 5,
        },
      },
    },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: { color: primary },
    //   },
    // },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: primary,
          margin: 0,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
                *::-webkit-scrollbar {
                    width: 10px;
                }
                *::-webkit-scrollbar-track {
                    background: #1b1a21;
                }
                *::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 20px;
                    border: 3px solid #1b1a21;
                }
                *::-webkit-scrollbar-thumb:hover {
                    background-color: #555;
                }
            `,
    },
  },
});

// https://material-ui.com/customization/theming/#responsivefontsizes-theme-options-theme
export default responsiveFontSizes(theme);
