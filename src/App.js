import "./App.css";
import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import _ from "lodash";
const rand = () => {
  return Math.round(Math.random() * 20) - 10;
};

const getModalStyle = () => {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  userForm: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

function App() {
  const classes = useStyles();
  const [gridWidth, setGridWidth] = useState(1);
  const [gridHeight, setGridHeight] = useState(1);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [resp, setResp] = useState(" ");
  const [avatar, setAvatar] = useState("1");
  const [splits, setSplits] = useState([]);
  const [playBoard, setPlayBoard] = useState([]);
  const [moves, setMoves] = useState(0);

  const gameBoard = (w, h) => {
    let board = [];
    for (let idxH = 1; idxH <= h; idxH++) {
      for (let idxW = 1; idxW <= w; idxW++) {
        let comb = `${idxH}${idxW}`;
        board.push(comb);
      }
    }

    return board;
  };
  const avatarPosition = (w, h) => {
    let widthMid;
    let heightMid;
    if (h === 1) {
      let newHeight = h + 1;
      heightMid = Math.floor(newHeight / 2);
    } else {
      heightMid = Math.floor(h / 2);
    }
    if (w === 1) {
      let newWidth = w + 1;
      widthMid = Math.floor(newWidth / 2);
    } else {
      widthMid = Math.floor(w / 2);
    }

    return `${heightMid}${widthMid}`;
  };

  const handleOpen = () => {
    setGridWidth(0);
    setGridHeight(0);
    setSplits([]);
    setOpen(true);
    setMoves(0);
  };

  const handleClose = () => {
    if (gridWidth > 1 && gridHeight > 1) {
      setAvatar(avatarPosition(gridWidth, gridHeight));
    }
    setOpen(false);
    let board = gameBoard(gridWidth, gridHeight);
    let newBoard = [...board];
    _.remove([...newBoard], (n) => n === avatar);
    setSplits(_.sampleSize(newBoard, gridHeight));
    setPlayBoard(gameBoard(gridWidth, gridHeight));
  };

  const handleHeightChange = (e) => {
    if (e.target.value > 1 && e.target.value < 10) {
      setGridHeight(e.target.value);
    } else {
      setResp(<p>Height should be between 1 and 9</p>);
    }
  };
  const handleWidthChange = (e) => {
    if (e.target.value > 1 && e.target.value < 10) {
      setGridWidth(e.target.value);
    } else {
      setResp(<p>Width should be between 1 and 9</p>);
    }
  };

  const boardRun = (e) => {
    e = e || window.event;

    if (e.keyCode === 38) {
      // up arrow
      let upMove = document.getElementById(`${avatar}`);
      if (
        upMove !== undefined &&
        upMove !== null &&
        playBoard.includes(avatar) &&
        parseInt(avatar) > 20
      ) {
        upMove.classList.add("plain");
        upMove.classList.remove("man");
        let moveUp = (parseInt(avatar) - 10).toString();
        if (splits.length > 1) {
          setMoves(moves + 1);
        }
        setAvatar(moveUp);
      }
    } else if (e.keyCode === 40) {
      // down arrow
      let downMove = document.getElementById(`${avatar}`);
      if (
        downMove !== undefined &&
        downMove !== null &&
        playBoard.includes(avatar) &&
        parseInt(avatar) < gridHeight * 10
      ) {
        downMove.classList.add("plain");
        downMove.classList.remove("man");
        let moveDown = (parseInt(avatar) + 10).toString();
        if (splits.length > 1) {
          setMoves(moves + 1);
        }
        setAvatar(moveDown);
      }
    } else if (e.keyCode === 37) {
      // left arrow
      let leftMove = document.getElementById(`${avatar}`);
      if (
        leftMove !== undefined &&
        leftMove !== null &&
        playBoard.includes((parseInt(avatar) - 1).toString())
      ) {
        leftMove.classList.add("plain");
        leftMove.classList.remove("man");
        let moveLeft = (parseInt(avatar) - 1).toString();
        if (splits.length > 1) {
          setMoves(moves + 1);
        }
        setAvatar(moveLeft);
      }
    } else if (e.keyCode === 39) {
      // right arrow

      let rightMove = document.getElementById(`${avatar}`);

      if (
        rightMove !== undefined &&
        rightMove !== null &&
        playBoard.includes(avatar) &&
        playBoard.includes((parseInt(avatar) + 1).toString())
      ) {
        rightMove.classList.add("plain");
        rightMove.classList.remove("man");
        let moveRight = (parseInt(avatar) + 1).toString();
        if (splits.length > 1) {
          setMoves(moves + 1);
        }
        setAvatar(moveRight);
      }
    }
  };
  document.onkeydown = boardRun;
  useEffect(() => {
    let getAvatar = document.getElementById(`${avatar}`);
    if (getAvatar !== undefined && getAvatar !== null) {
      if (getAvatar.classList.contains("food")) {
        getAvatar.classList.remove("food");
        _.remove(splits, (n) => n === avatar);
      }
      getAvatar.classList.remove("plain");
      getAvatar.classList.add("man");
    }
    setTimeout(() => {
      _.forEach(splits, (value) => {
        if (value !== avatar) {
          let split = document.getElementById(`${value}`);
          split.classList.remove("plain");
          split.classList.add("food");
        }
      });
    }, 1000);
  }, [avatar, splits]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Input board height and width:</h2>
      {resp}
      <form className={classes.userForm} noValidate autoComplete="off">
        <TextField
          id="standard-basic"
          label="Height"
          onChange={handleHeightChange}
        />
        <TextField
          id="standard-basic"
          label="Width"
          onChange={handleWidthChange}
        />
      </form>
    </div>
  );

  return (
    <div className={`root`}>
      <div className={`App`}>
        <div className={`user-form`}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleOpen}
          >
            Input board height and width
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
          <div>
            {splits.length <= 1 ? (
              <div>
                <p>Game Over!!!!</p>
                <p>Add board dimensions to play</p>
                <p>Yours Scores: {moves}</p>
              </div>
            ) : (
              <p>Game in progress</p>
            )}
          </div>
        </div>
        {Array.from({ length: gridHeight }, (_, h) => h + 1).map((hValue) => (
          <Grid key={hValue} container spacing={1} direction="row">
            {Array.from({ length: gridWidth }, (_, i) => i + 1).map((value) => (
              <Grid key={value} item>
                <Paper className={`cell`}>
                  <span id={`${hValue}${value}`} className={`plain`}>
                    {/* {`${hValue}${value}`} */}
                  </span>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ))}
      </div>
    </div>
  );
}

export default App;
