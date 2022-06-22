import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const SideDrawer: React.FC<{
  drawerOpen: boolean;
  setDrawerOpen: (val: boolean) => void;
}> = ({ drawerOpen, setDrawerOpen }) => {
  const drawerWidth = 240;
  const navigate = useNavigate();
  return (
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
        <Box sx={{ padding: "1em" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Yleistä
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/");
                }}
              >
                Etusivu
              </ListItemButton>
            </ListItem>
          </List>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Äänipelit
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/audio/random");
                }}
              >
                Sekoitus
              </ListItemButton>
            </ListItem>
          </List>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sanoituspelit
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/lyrics/arttu-wiskari");
                }}
              >
                Arttu Wiskari
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/missing-lyrics/arttu-wiskari");
                }}
              >
                Arttu Wiskari 2
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/lyrics/haloo-helsinki");
                }}
              >
                Haloo Helsinki!
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/missing-lyrics/haloo-helsinki");
                }}
              >
                Haloo Helsinki! 2
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};
