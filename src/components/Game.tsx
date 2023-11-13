import { useState } from 'react'
import constants from '../util/constants'
import Invader from './Invader'
import Player from './Player'

const gameStates = ["Playing", "Complete"] as const
type GameState = (typeof gameStates)[number]

// yes these names are ovely cute
// but the InvaderHorde is all the invaders on the screen
// the InvaderCohort is one row of them
type InvaderHorde = InvaderCohort[]
type InvaderCohort = number[]

const initialInvaders = [...Array(constants.invaderRows)].map(() => [...Array(constants.invadersPerRow)].map(() => 1))

function Game() {
    const [gameState, setGameState] = useState<GameState>("Complete")
    const [invaderRows, setInvaderRows] = useState<InvaderHorde>(initialInvaders)

    const gap = (constants.gameWidth * 0.4) / constants.invadersPerRow

    const invaderEls = <div style={{display: "grid", gap}}>{invaderRows.map((invaderRow: InvaderCohort, i: number) => {
        return <div style={{gridRow: i + 1}}>{invaderRow.map((el: number, j) => {return el === 1 ? <Invader key={`invader${i}-${j}`} /> : null})}</div>
    })}</div>

    return <div style={{width: constants.gameWidth, height: constants.gameHeight, backgroundColor: constants.backgroundColor}}>
        {
            gameState == "Playing" ? <>{invaderEls}<Player /></> : <button onClick={() => setGameState("Playing")}>Start</button>
        }
    </div>
}

export default Game