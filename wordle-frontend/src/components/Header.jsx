import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "#025375" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wordle (created by{" "}
            <a href="https://www.github.com/audiocx" style={{ color: "white" }}>
              audiocx
            </a>
            )
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
