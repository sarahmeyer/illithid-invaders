import invaderThumb from '../assets/invader.svg'
import constants from '../util/constants'

type InvaderProps = {
    key: string
}

function Invader(props: InvaderProps) {
    const { key } = props
    const invaderWidth = (constants.gameWidth * 0.6) / constants.invadersPerRow
    
    return <img key={key} style={{width: invaderWidth}} src={invaderThumb} alt="invader" />
}

export default Invader