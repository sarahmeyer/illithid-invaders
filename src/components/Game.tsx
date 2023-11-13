import { useState } from 'react'
import constants from '../util/constants'
import Invader from './Invader'
import Player from './Player'

const gameStates = ["Playing", "Complete"] as const
type GameState = (typeof gameStates)[number]

const initialInvaders = [...Array(constants.invaderRows)].map(() => [...Array(constants.invadersPerRow)].map(() => 1))

function Game() {
    const [gameState, setGameState] = useState<GameState>("Complete")
    const [invaderRows, setInvaderRows] = useState(initialInvaders)

    return <div style={{width: constants.width, height: constants.height}}>
        {
            gameState == "Playing" ? <>{invaderRows.map((invaderRow) => {
                invaderRow.map((el) => el === 1 ? <Invader /> : null)
            })}<Player /></> : <button onClick={() => setGameState("Playing")}>Start</button>
        }
    </div>
}

export default Game