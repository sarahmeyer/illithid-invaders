import playerThumb from '../assets/player.svg'
import constants from '../util/constants'

function Player() {
    return <img style={{width: constants.playerWidth}} src={playerThumb} alt="player" />
}

export default Player