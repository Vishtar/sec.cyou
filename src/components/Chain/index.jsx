import { joinClassName } from '../../helpers/joinClassName';

import './style.css';

export const Chain = ({ onClick, className, name }) => {
    return <span
        className={joinClassName(["card-chain-logo", className])}
        title={name}
        style={{
            backgroundImage: `url('./assets/logos/${name}.svg')`,
        }}
        onClick={onClick}
    />
}
