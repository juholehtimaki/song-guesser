import { useState } from "react";
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Dangerous,
} from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import _ from "lodash";
import s from "string-similarity";
import "./../App.css";
import { ScoreBar } from "../components/ScoreBar";

interface LyricSong {
  artist: string;
  songName: string;
  image: string;
  lyrics: string;
  options: string[][];
}

interface LyricGameQuestion extends LyricSong {
  correct?: boolean;
  hint?: string[];
}

export const GuessByLyrics: React.FC<{ gameData: LyricSong[] }> = ({
  gameData,
}) => {
  const setInitialLyricGameState = (data: LyricSong[]) => {
    const shuffled = _.shuffle(data) as LyricSong[];
    const shuffledWithOption = shuffled.map((s) => ({
      ...s,
      hint: _.sample(s.options)?.join("\n"),
    })) as LyricGameQuestion[];
    return shuffledWithOption;
  };
  const [guess, setGuess] = useState("");
  const [songIdx, setSongIdx] = useState(0);
  const [lyricGameState, setLyricGameState] = useState(
    setInitialLyricGameState(gameData)
  );
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [rightGuesses, setRightGuesses] = useState(0);

  const handleAnswer = () => {
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
  };

  const canShowNextQuestion = () => {
    if (lyricGameState[songIdx].correct === undefined) return false;
    if (songIdx + 1 >= lyricGameState.length) return false;
    return true;
  };

  const renderTextFieldOrMark = () => {
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
  };

  return (
    <Box className="App">
      <Box sx={{ marginTop: "1em", padding: "1em" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          <Box>
            <Typography
              variant="h5"
              sx={{ whiteSpace: "pre-line", color: "#ffff" }}
            >
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
              sx={{ marginTop: "1em", color: "#ffff" }}
            >{`${lyricGameState[songIdx].artist} - ${lyricGameState[songIdx].songName}`}</Typography>
            <Typography
              sx={{ whiteSpace: "pre-line", marginTop: "1em", color: "#ffff" }}
            >
              {lyricGameState[songIdx].lyrics}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ height: "64px" }}></Box>
      <ScoreBar score={rightGuesses} totalScore={totalGuesses} />
    </Box>
  );
};
