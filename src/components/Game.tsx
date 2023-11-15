import invaderThumb from "../assets/invader.svg";
import playerThumb from "../assets/player.svg";

import { KeyboardEvent, createRef, useEffect, useRef, useState } from "react";
import constants from "../util/constants";

type GameState = "Playing" | "Not Started" | "Lost";

type InvaderHorde = number[];

const LIVING_INVADER_VALUE = 1;
const DEAD_INVADER_VALUE = 0;

const initialInvaders = [
  ...Array(constants.invaderRows * constants.invadersPerRow),
].map(() => LIVING_INVADER_VALUE);

function Game() {
  const [gameState, setGameState] = useState<GameState>("Not Started");
  const [currentInvaders, setCurrentInvaders] =
    useState<InvaderHorde>(initialInvaders);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    constants.gameDuration,
  );
  const [playerOffset, setPlayerOffset] = useState<number>(0);

  const invaderRefs = useRef<any>(currentInvaders.map(() => createRef()));
  const playerRef = useRef<any>(null);

  const gap = (constants.gameWidth * 0.4) / constants.invadersPerRow;

  const invaderOffsetY =
    constants.gameHeight * (1 - timeRemaining / constants.gameDuration);
  const invaderOffsetX = (timeRemaining % gap) * 2;
  const invaderEls = (
    <div
      style={{
        display: "grid",
        gap,
        top: invaderOffsetY,
        left: invaderOffsetX,
        position: "absolute",
      }}
    >
      {currentInvaders.map((invader: number, i: number) => {
        if (invader === LIVING_INVADER_VALUE) {
          const x = (i % constants.invadersPerRow) + 1;
          const y = (i % constants.invaderRows) + 1;
          const invaderWidth =
            (constants.gameWidth * 0.4) / constants.invadersPerRow;

          return invader === 1 ? (
            <img
              key={`${x}-${y}`}
              style={{ gridColumn: x, gridRow: y, width: invaderWidth }}
              src={invaderThumb}
              alt="invader"
              ref={invaderRefs.current[i]}
            />
          ) : null;
        }
      })}
    </div>
  );

  const onClickStart = () => {
    setGameState("Playing");
    setTimeRemaining(constants.gameDuration);
    setPlayerOffset(0);
  };

  const startGameButton = <button onClick={onClickStart}>Start</button>;

  useEffect(() => {
    const playerMovementRange =
      (constants.gameWidth - constants.playerWidth) / 2;
    const onKeyDown = (evt: KeyboardEvent) => {
      if (gameState === "Playing") {
        if (evt.key === "ArrowLeft" && playerOffset >= -playerMovementRange) {
          setPlayerOffset(playerOffset - constants.playerSpeed);
        }
        if (evt.key === "ArrowRight" && playerOffset <= playerMovementRange) {
          setPlayerOffset(playerOffset + constants.playerSpeed);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [gameState, playerOffset, setPlayerOffset]);

  useEffect(() => {
    if (gameState === "Playing") {
      const interval = setInterval(() => {
        setTimeRemaining((prevTimeRemaining: number) => {
          const playerBoundingRect = playerRef.current?.getBoundingClientRect();
          currentInvaders.forEach((invader, i) => {
            if (
              invader === LIVING_INVADER_VALUE &&
              invaderRefs.current &&
              invaderRefs.current[i] &&
              invaderRefs.current[i].current
            ) {
              const testBoundingRect =
                invaderRefs.current[i]?.current?.getBoundingClientRect();

              if (
                playerBoundingRect.left <
                  testBoundingRect.left + testBoundingRect.width &&
                playerBoundingRect.left + playerBoundingRect.width >
                  testBoundingRect.left &&
                playerBoundingRect.top <
                  testBoundingRect.top + testBoundingRect.height &&
                playerBoundingRect.height + playerBoundingRect.top >
                  testBoundingRect.top
              ) {
                clearInterval(interval);
                setGameState("Lost");
              }
            }
          });

          if (prevTimeRemaining && prevTimeRemaining > 0) {
            return prevTimeRemaining - 1;
          } else {
            clearInterval(interval);
            setGameState("Not Started");
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, timeRemaining, currentInvaders]);

  let gameContentsByState;
  switch (gameState) {
    case "Playing":
      gameContentsByState = (
        <>
          {invaderEls}

          <img
            style={{
              boxSizing: "border-box",
              top: constants.gameHeight - (constants.playerWidth + 5),
              left:
                (constants.gameWidth - constants.playerWidth) / 2 +
                playerOffset,
              width: constants.playerWidth,
              position: "absolute",
            }}
            src={playerThumb}
            alt="player"
            ref={playerRef}
          />
        </>
      );
      break;
    case "Not Started":
      gameContentsByState = startGameButton;
      break;
    case "Lost":
      gameContentsByState = (
        <>
          <h1>You Lost</h1>
          <br />
          {startGameButton}
        </>
      );
      break;
  }

  return (
    <div
      style={{
        width: constants.gameWidth,
        height: constants.gameHeight,
        backgroundColor: constants.backgroundColor,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {gameContentsByState}
    </div>
  );
}

export default Game;
