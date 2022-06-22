import { useState } from "react";
import haloohelsinki from "./assets/lyrics/haloohelsinki.json";
import arttuwiskari from "./assets/lyrics/arttuwiskari.json";
import soundgamedata from "./assets/songs/songs.json";
import {
  AppBar,
  createTheme,
  IconButton,
  responsiveFontSizes,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu, MusicNote } from "@mui/icons-material";
import { Route, Routes } from "react-router-dom";
import { HomeView } from "./views/HomeView";
import { GuessByLyrics } from "./views/GuessByLyrics";
import { SideDrawer } from "./components/SideDrawer";
import { GuessByAudio } from "./views/GuessByAudio";
import { GuessMissingWord } from "./views/GuessMissingWord";

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
  })
);

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            disabled={false}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "center" }}>
            <MusicNote />
            BIISITIETÄJÄ
            <MusicNote />
          </Typography>
        </Toolbar>
      </AppBar>
      <SideDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route
          path="/lyrics/haloo-helsinki"
          element={<GuessByLyrics key="haloo" gameData={haloohelsinki} />}
        />
        <Route
          path="/lyrics/arttu-wiskari"
          element={<GuessByLyrics key="helsinki" gameData={arttuwiskari} />}
        />
        <Route
          path="/missing-lyrics/haloo-helsinki"
          element={
            <GuessMissingWord key="helsinki-missing" gameData={haloohelsinki} />
          }
        />
        <Route
          path="/missing-lyrics/arttu-wiskari"
          element={
            <GuessMissingWord key="missing-missing" gameData={arttuwiskari} />
          }
        />
        <Route
          path="/audio/random"
          element={<GuessByAudio key="audio" gameData={soundgamedata} />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
