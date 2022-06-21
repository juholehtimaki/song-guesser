import { AppBar, Toolbar, Typography } from "@mui/material";

export const ScoreBar: React.FC<{ score: number; totalScore: number }> = ({
  score,
  totalScore,
}) => {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "center" }}>
          {`Oikein: ${score} / ${totalScore}`}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
