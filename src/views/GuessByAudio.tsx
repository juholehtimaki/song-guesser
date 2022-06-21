import { useEffect, useState } from "react";
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Dangerous,
  PlayCircle,
  StopCircle,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import s from "string-similarity";
import "./../App.css";
import { ScoreBar } from "../components/ScoreBar";

interface AudioSong {
  artist: string;
  songName: string;
  url: string;
  id: string;
}

interface AudioGameQuestion extends AudioSong {
  correct?: boolean;
  audio?: HTMLAudioElement;
}

export const GuessByAudio: React.FC<{ gameData: AudioSong[] }> = ({
  gameData,
}) => {
  const setInitialAudioGameState = () => {
    const shuffled = _.shuffle(gameData) as AudioGameQuestion[];
    const songs = shuffled.map((s) => ({
      ...s,
      audio: new Audio(require(`./../assets/songs/${s.id}.mp3`)),
    }));
    return songs;
  };
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [rightGuesses, setRightGuesses] = useState(0);
  const [guess, setGuess] = useState("");
  const [songIdx, setSongIdx] = useState(0);
  const [audioGameState, setAudioGameState] = useState(
    setInitialAudioGameState()
  );
  const [audio, setAudio] = useState(audioGameState[0].audio);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  });

  useEffect(() => {
    setPlaying(false);
    audio.currentTime = 0;
    audio.pause();
    setAudio(audioGameState[songIdx].audio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songIdx]);

  const handleAnswer = () => {
    const currState = _.cloneDeep(audioGameState);
    const string1 = guess.toLowerCase();
    const string2 = currState[songIdx].songName.toLowerCase();
    const similarity = s.compareTwoStrings(string1, string2);
    const wasCorrectAnswer = similarity > 0.7;
    currState[songIdx].correct = wasCorrectAnswer;
    if (wasCorrectAnswer) setRightGuesses(rightGuesses + 1);
    setTotalGuesses(totalGuesses + 1);
    setAudioGameState(currState);
    setGuess("");
  };

  const canShowNextQuestion = () => {
    if (audioGameState[songIdx].correct === undefined) return false;
    if (songIdx + 1 >= audioGameState.length) return false;
    return true;
  };

  const renderTextFieldOrMark = () => {
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
  };

  return (
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
      <Box sx={{ height: "64px" }}></Box>
      <ScoreBar score={rightGuesses} totalScore={totalGuesses} />
    </Box>
  );
};
