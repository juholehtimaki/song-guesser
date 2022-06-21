import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./../App.css";

export const HomeView = () => {
  const navigate = useNavigate();
  return (
    <Box className="App">
      <Box sx={{ marginTop: "2em" }}>
        <Typography variant="h6" sx={{ color: "#ffff" }}>
          Sivulle on kerätty erilaisien artistien biisejä, sanoituksia ja
          melodioita.
        </Typography>
        <Typography variant="h6" sx={{ color: "#ffff" }}>
          Tavoitteena on arvata kyseessä oleva biisi arvottujen sanoituksien tai
          kuultavan melodian avulla.
        </Typography>
        <Typography variant="h6" sx={{ color: "#ffff", marginTop: "2em" }}>
          Sanoituksien avulla arvattavat biisit
        </Typography>
        <List>
          <ListItem style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => navigate("/lyrics/arttu-wiskari")}>
              Arttu Wiskari
            </Button>
          </ListItem>
          <ListItem style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => navigate("/lyrics/haloo-helsinki")}>
              Haloo Helsinki!
            </Button>
          </ListItem>
        </List>
        <Typography variant="h6" sx={{ color: "#ffff", marginTop: "2em" }}>
          Arvaa puuttuva sana
        </Typography>
        <List>
          <ListItem style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => navigate("/missing-lyrics/haloo-helsinki")}>
              Haloo Helsinki!
            </Button>
          </ListItem>
        </List>
        <Typography variant="h6" sx={{ color: "#ffff", marginTop: "2em" }}>
          Melodian avulla arvattavat biisit
        </Typography>
        <List>
          <ListItem style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => navigate("/audio/random")}>
              Sekalaista
            </Button>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
