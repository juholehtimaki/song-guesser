import React, { useState } from "react";
import "./App.css";
import haloohelsinki from "./assets/lyrics/haloohelsinki.json";
import arttuwiskari from "./assets/lyrics/arttuwiskari.json";
import _ from "lodash";
import {
  AppBar,
  Box,
  Button,
  Card,
  createTheme,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  responsiveFontSizes,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Dangerous,
  Menu,
  MusicNote,
} from "@mui/icons-material";

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
  })
);
interface Song {
  artist: string;
  songName: string;
  image: string;
  lyrics: string;
  options: string[][];
}

interface GameQuestion extends Song {
  correct?: boolean;
  hint?: string[];
}

function App() {
  const setInitialGameState = (data: Song[]) => {
    const shuffled = _.shuffle(data) as Song[];
    const shuffledWithOption = shuffled.map((s) => ({
      ...s,
      hint: _.sample(s.options)?.join("\n"),
    })) as GameQuestion[];
    return shuffledWithOption;
  };

  const [guess, setGuess] = useState("");
  const [songIdx, setSongIdx] = useState(0);
  const [gameState, setGameState] = useState(
    setInitialGameState(haloohelsinki)
  );
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [rightGuesses, setRightGuesses] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAnswer = () => {
    const currState = _.cloneDeep(gameState);
    const wasCorrectAnswer =
      guess.toLowerCase() === currState[songIdx].songName.toLowerCase();
    currState[songIdx].correct = wasCorrectAnswer;
    if (wasCorrectAnswer) setRightGuesses(rightGuesses + 1);
    setTotalGuesses(totalGuesses + 1);
    setGameState(currState);
    setGuess("");
  };

  const canShowNextQuestion = () => {
    if (gameState[songIdx].correct === undefined) return false;
    if (songIdx + 1 >= gameState.length) return false;
    return true;
  };

  const renderTextFieldOrMark = () => {
    if (gameState[songIdx].correct === true)
      return <CheckCircle sx={{ fontSize: "5em", color: "green" }} />;
    if (gameState[songIdx].correct === false)
      return <Dangerous sx={{ fontSize: "5em", color: "red" }} />;
    return (
      <TextField
        label="Kappaleen nimi"
        variant="outlined"
        autoComplete="off"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
    );
  };

  const drawer = (
    <Box sx={{ padding: "1em" }}>
      <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
        Artistit & Bändit
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleGameSwap(arttuwiskari)}>
            Arttu Wiskari
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleGameSwap(haloohelsinki)}>
            Haloo Helsinki!
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const handleGameSwap = (newGameData: Song[]) => {
    setGuess("");
    setTotalGuesses(0);
    setRightGuesses(0);
    setSongIdx(0);
    setDrawerOpen(false);
    setGameState(setInitialGameState(newGameData));
  };

  const drawerWidth = 240;

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
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
            SANOITUKSET
            <MusicNote />
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(!drawerOpen)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box className="App">
        <Card sx={{ marginTop: "1em", padding: "1em" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <Box>
              <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
                {gameState[songIdx].hint}
              </Typography>
            </Box>
            <Box>{renderTextFieldOrMark()}</Box>
            <Box>
              <IconButton
                onClick={() => setSongIdx(songIdx - 1)}
                disabled={songIdx === 0}
              >
                <ArrowBack />
              </IconButton>
              <Button
                onClick={handleAnswer}
                variant="contained"
                disabled={guess.length === 0}
              >
                Arvaa
              </Button>
              <IconButton
                onClick={() => setSongIdx(songIdx + 1)}
                disabled={!canShowNextQuestion()}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          </Box>
          {gameState[songIdx].correct !== undefined && (
            <Box sx={{ marginTop: "1em" }}>
              <Box sx={{ marginTop: "1em" }}>
                <img src={gameState[songIdx].image} alt="album" width={200} />
              </Box>
              <Typography
                variant="h5"
                sx={{ marginTop: "1em" }}
              >{`${gameState[songIdx].artist} - ${gameState[songIdx].songName}`}</Typography>
              <Typography sx={{ whiteSpace: "pre-line", marginTop: "1em" }}>
                {gameState[songIdx].lyrics}
              </Typography>
            </Box>
          )}
        </Card>
      </Box>
      <Box sx={{ height: "64px" }}></Box>
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "center" }}>
            {`Oikein: ${rightGuesses} / ${totalGuesses}`}
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default App;
