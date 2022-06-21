import React, { useEffect, useState } from "react";
import "./App.css";
import haloohelsinki from "./assets/lyrics/haloohelsinki.json";
import arttuwiskari from "./assets/lyrics/arttuwiskari.json";
import soundgamedata from "./assets/songs/songs.json";
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
  PlayCircle,
  StopCircle,
} from "@mui/icons-material";
import s from "string-similarity";

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
  })
);
interface LyricSong {
  artist: string;
  songName: string;
  image: string;
  lyrics: string;
  options: string[][];
}

interface SoundSong {
  artist: string;
  songName: string;
  url: string;
  id: string;
}

interface SoundSongQuestion extends SoundSong {
  correct?: boolean;
}

interface LyricGameQuestion extends LyricSong {
  correct?: boolean;
  hint?: string[];
}

enum GameMode {
  SOUND,
  LYRICS,
}

function App() {
  const setInitialLyricGameState = (data: LyricSong[]) => {
    const shuffled = _.shuffle(data) as LyricSong[];
    const shuffledWithOption = shuffled.map((s) => ({
      ...s,
      hint: _.sample(s.options)?.join("\n"),
    })) as LyricGameQuestion[];
    return shuffledWithOption;
  };

  const setInitialSoundGameState = () => {
    const shuffled = _.shuffle(soundgamedata) as SoundSongQuestion[];
    return shuffled;
  };

  const [guess, setGuess] = useState("");
  const [songIdx, setSongIdx] = useState(0);
  const [lyricGameState, setLyricGameState] = useState(
    setInitialLyricGameState(haloohelsinki)
  );
  const [audioGameState, setAudioGameState] = useState(
    setInitialSoundGameState()
  );
  const [gameMode, setGameMode] = useState(GameMode.SOUND);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [rightGuesses, setRightGuesses] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAnswer = () => {
    if (gameMode === GameMode.LYRICS) {
      const currState = _.cloneDeep(lyricGameState);
      const string1 = guess.toLowerCase();
      const string2 = currState[songIdx].songName.toLowerCase();
      const similarity = s.compareTwoStrings(string1, string2);
      const wasCorrectAnswer = similarity > 0.7;
      currState[songIdx].correct = wasCorrectAnswer;
      if (wasCorrectAnswer) setRightGuesses(rightGuesses + 1);
      setTotalGuesses(totalGuesses + 1);
      setLyricGameState(currState);
      setGuess("");
    }
    if (gameMode === GameMode.SOUND) {
      const currState = _.cloneDeep(audioGameState);
      const wasCorrectAnswer =
        guess.toLowerCase() === currState[songIdx].songName.toLowerCase();
      currState[songIdx].correct = wasCorrectAnswer;
      if (wasCorrectAnswer) setRightGuesses(rightGuesses + 1);
      setTotalGuesses(totalGuesses + 1);
      setAudioGameState(currState);
      setGuess("");
    }
  };

  const canShowNextQuestion = () => {
    if (gameMode === GameMode.LYRICS) {
      if (lyricGameState[songIdx].correct === undefined) return false;
      if (songIdx + 1 >= lyricGameState.length) return false;
      return true;
    }
    if (audioGameState[songIdx].correct === undefined) return false;
    if (songIdx + 1 >= audioGameState.length) return false;
    return true;
  };

  const renderTextFieldOrMark = () => {
    if (gameMode === GameMode.LYRICS) {
      if (lyricGameState[songIdx].correct === true)
        return <CheckCircle sx={{ fontSize: "5em", color: "green" }} />;
      if (lyricGameState[songIdx].correct === false)
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
    }
    if (gameMode === GameMode.SOUND) {
      if (audioGameState[songIdx].correct === true)
        return <CheckCircle sx={{ fontSize: "5em", color: "green" }} />;
      if (audioGameState[songIdx].correct === false)
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
    }
  };

  const drawer = (
    <Box sx={{ padding: "1em" }}>
      <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
        Äänipelit
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleGameSwap([], GameMode.SOUND)}>
            Sekoitus
          </ListItemButton>
        </ListItem>
      </List>
      <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
        Sanoituspelit
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleGameSwap(arttuwiskari, GameMode.LYRICS)}
          >
            Arttu Wiskari
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleGameSwap(haloohelsinki, GameMode.LYRICS)}
          >
            Haloo Helsinki!
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const handleGameSwap = (
    newGameData: LyricSong[] = [],
    gameMode: GameMode
  ) => {
    setGuess("");
    setTotalGuesses(0);
    setRightGuesses(0);
    setSongIdx(0);
    setDrawerOpen(false);
    setGameMode(gameMode);
    audio.currentTime = 0;
    audio.pause();
    setPlaying(false);
    if (gameMode === GameMode.LYRICS)
      setLyricGameState(setInitialLyricGameState(newGameData));
    if (gameMode === GameMode.SOUND)
      setAudioGameState(setInitialSoundGameState());
  };

  const [audio, setAudio] = useState(
    new Audio(require(`./assets/songs/${audioGameState[songIdx].id}.mp3`))
  );
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  });

  useEffect(() => {
    setAudio(
      new Audio(require(`./assets/songs/${audioGameState[songIdx].id}.mp3`))
    );
    audio.currentTime = 0;
    setPlaying(false);
    audio.pause();
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [songIdx]);

  const drawerWidth = 240;

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            disabled={true}
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
      {gameMode === GameMode.SOUND && (
        <Box className="App">
          <Card sx={{ marginTop: "1em", padding: "1em" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
              <Box>
                {!playing && (
                  <IconButton
                    onClick={() => {
                      audio.currentTime = 0;
                      audio.play();
                      setPlaying(true);
                    }}
                  >
                    <PlayCircle sx={{ fontSize: "5em" }} />
                  </IconButton>
                )}
                {playing && (
                  <IconButton
                    onClick={() => {
                      audio.currentTime = 0;
                      audio.pause();
                      setPlaying(false);
                    }}
                  >
                    <StopCircle sx={{ fontSize: "5em" }} />
                  </IconButton>
                )}
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
            {audioGameState[songIdx].correct !== undefined && (
              <Box sx={{ marginTop: "1em" }}>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "1em", marginBottom: "1em" }}
                >{`${audioGameState[songIdx].artist} - ${audioGameState[songIdx].songName}`}</Typography>
                <iframe
                  width="350"
                  height="200"
                  src={`https://www.youtube.com/embed/${audioGameState[songIdx].id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              </Box>
            )}
          </Card>
        </Box>
      )}
      {gameMode === GameMode.LYRICS && (
        <Box className="App">
          <Card sx={{ marginTop: "1em", padding: "1em" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
              <Box>
                <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
                  {lyricGameState[songIdx].hint}
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
                  onClick={() => {
                    audio.currentTime = 0;
                    audio.pause();
                    setPlaying(false);
                    setSongIdx(songIdx + 1);
                  }}
                  disabled={!canShowNextQuestion()}
                >
                  <ArrowForward />
                </IconButton>
              </Box>
            </Box>
            {lyricGameState[songIdx].correct !== undefined && (
              <Box sx={{ marginTop: "1em" }}>
                <Box sx={{ marginTop: "1em" }}>
                  <img
                    src={lyricGameState[songIdx].image}
                    alt="album"
                    width={200}
                  />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "1em" }}
                >{`${lyricGameState[songIdx].artist} - ${lyricGameState[songIdx].songName}`}</Typography>
                <Typography sx={{ whiteSpace: "pre-line", marginTop: "1em" }}>
                  {lyricGameState[songIdx].lyrics}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      )}
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
