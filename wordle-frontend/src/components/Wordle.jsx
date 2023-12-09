import * as React from "react";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Header from "./Header";
import {
  Box,
  Grid,
  createTheme,
  ThemeProvider,
  Typography,
} from "@mui/material";

const theme = createTheme({
  palette: {
    inplace: { main: "#558b2f" },
    noplace: { main: "#9e9d24" },
    notinword: { main: "#595959" },
    unvisited: { main: "#808080" },
  },
});

export default function Wordle() {
  const [won, setWon] = useState(false);
  const [enter, setEnter] = useState(true);
  const [targetWord, setTargetWord] = useState(["", "", "", "", ""]);

  const [letterState, setLetterState] = useState(
    // inplace, noplace, notinword, unvisited
    {
      A: "unvisited",
      B: "unvisited",
      C: "unvisited",
      D: "unvisited",
      E: "unvisited",
      F: "unvisited",
      G: "unvisited",
      H: "unvisited",
      I: "unvisited",
      J: "unvisited",
      K: "unvisited",
      L: "unvisited",
      M: "unvisited",
      N: "unvisited",
      O: "unvisited",
      P: "unvisited",
      Q: "unvisited",
      R: "unvisited",
      S: "unvisited",
      T: "unvisited",
      U: "unvisited",
      V: "unvisited",
      W: "unvisited",
      X: "unvisited",
      Y: "unvisited",
      Z: "unvisited",
      ENTER: "unvisited",
      BACK: "unvisited",
    }
  );

  const [currTry, setCurrTry] = useState(0);

  const [tries, setTries] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  const [gridState, setGridState] = useState([
    ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
    ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
    ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
    ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
    ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
    ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
  ]);

  const letterRow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const letterRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const letterRow3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const handleWordFetch = async () => {
    const requestBody = {
      query: `
        query {
          getWord
        }
      `,
    };

    await fetch("http://localhost:4000", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (data.data.getWord) {
          const tword = data.data.getWord.toUpperCase().split("");
          setTargetWord(tword);
          console.log("Word is " + data.data.getWord.toUpperCase() + " :)");
        }
      });
  };

  const handleReset = () => {
    setWon(false);
    setEnter(true);
    setCurrTry(0);
    setTries([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    setGridState([
      ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
      ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
      ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
      ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
      ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
      ["unvisited", "unvisited", "unvisited", "unvisited", "unvisited"],
    ]);
    setLetterState({
      A: "unvisited",
      B: "unvisited",
      C: "unvisited",
      D: "unvisited",
      E: "unvisited",
      F: "unvisited",
      G: "unvisited",
      H: "unvisited",
      I: "unvisited",
      J: "unvisited",
      K: "unvisited",
      L: "unvisited",
      M: "unvisited",
      N: "unvisited",
      O: "unvisited",
      P: "unvisited",
      Q: "unvisited",
      R: "unvisited",
      S: "unvisited",
      T: "unvisited",
      U: "unvisited",
      V: "unvisited",
      W: "unvisited",
      X: "unvisited",
      Y: "unvisited",
      Z: "unvisited",
      ENTER: "unvisited",
      BACK: "unvisited",
    });
    handleWordFetch();
  };

  const handleCheckWord = async () => {
    const wordToCheck = tries[currTry].join("").toLowerCase();
    const targetWordString = targetWord.join("").toLowerCase();

    const requestBody = {
      query: `
        query {
          wordExists(word: "${wordToCheck}")
        }
      `,
    };

    await fetch("http://localhost:4000", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (data.data.wordExists) {
          let tempLetterState = { ...letterState };
          let tempGridState = [...gridState];

          tries[currTry].forEach((letter, i) => {
            if (letter === targetWord[i]) {
              tempLetterState[letter] = "inplace";
              tempGridState[currTry][i] = "inplace";
            } else if (!targetWord.includes(letter)) {
              tempLetterState[letter] = "notinword";
              tempGridState[currTry][i] = "notinword";
            } else if (targetWord.includes(letter)) {
              tempLetterState[letter] =
                tempLetterState[letter] === "inplace" ? "inplace" : "noplace";
              tempGridState[currTry][i] = "noplace";
            }
          });

          setGridState(tempGridState);
          setLetterState(tempLetterState);

          if (currTry <= 5) {
            setCurrTry(currTry + 1);
            setEnter(true);
          }

          if (wordToCheck === targetWordString) {
            setWon(true);
            alert("Congratulations!");
          } else {
            if (currTry >= 5) {
              alert("Too many tries!");
              handleReset();
            }
          }
        } else {
          alert("Word not found in dictionary");
        }
      });
  };

  const writeTry = (e) => {
    let temp = [...tries];
    tries[currTry].every((letter, i) => {
      if (letter === "") {
        temp[currTry][i] = e.target.textContent;
        return false;
      } else {
        temp[currTry][i] = letter;
        return true;
      }
    });
    setTries(temp);

    const currWord = tries[currTry].join("");
    if (currWord.length > 4) {
      setEnter(false);
    }
  };

  const deleteLetter = () => {
    let temp = [...tries];
    let lastLetter = 0;
    tries[currTry].forEach((letter, i) => {
      if (letter != "") {
        lastLetter = i;
      }
    });
    temp[currTry][lastLetter] = "";
    setTries(temp);
  };

  const letterRender = (letter) => {
    return (
      <Box m={1}>
        <Button
          variant="contained"
          color={letterState[letter]}
          onClick={writeTry}
          disabled={won}
        >
          {letter}
        </Button>
      </Box>
    );
  };

  const tryGrid = () => {
    const bgColor = (st) => {
      if (st === "inplace") return "#558b2f";
      if (st === "noplace") return "#9e9d24";
      if (st === "notinword") return "#595959";
      return "#808080";
    };
    return (
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Grid container maxWidth={"63%"}>
          <Grid item xs={3}></Grid>
          {tries &&
            tries.map((tryn, tryIndex) => {
              return (
                <Grid
                  container
                  justifyContent={"center"}
                  alignItems={"center"}
                  display={"flex"}
                >
                  <Grid item xs={3}></Grid>
                  {tryn.map((letter, letterIndex) => {
                    return (
                      <Grid item xs={1}>
                        <Box
                          m={1}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          sx={{
                            height: "auto",
                            aspectRatio: 1,
                          }}
                          backgroundColor={bgColor(
                            gridState[tryIndex][letterIndex]
                          )}
                        >
                          <Typography color={"white"} variant="h3">
                            {letter}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                  <Grid item xs={3}></Grid>
                </Grid>
              );
            })}
          <Grid item xs={3}></Grid>
        </Grid>
      </Box>
    );
  };

  useEffect(() => {
    handleWordFetch();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header></Header>

        {tryGrid()}

        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
        >
          <Grid item xs={12}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {letterRow1 && letterRow1.map((letter) => letterRender(letter))}
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {letterRow2 && letterRow2.map((letter) => letterRender(letter))}
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box m={1}>
                <Button
                  variant="contained"
                  color={letterState["ENTER"]}
                  onClick={handleCheckWord}
                  disabled={enter}
                >
                  ENTER
                </Button>
              </Box>
              {letterRow3 && letterRow3.map((letter) => letterRender(letter))}
              <Box m={1}>
                <Button
                  variant="contained"
                  color={letterState["BACK"]}
                  onClick={deleteLetter}
                  disabled={won}
                >
                  BACK
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              m={1}
            >
              <Button variant="contained" onClick={handleReset}>
                RESET
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
