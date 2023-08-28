import { Chain } from "../";
import { joinClassName } from '../../helpers/joinClassName';

import './style.css';

export const ChainTag = ({ isActive, onClick, ...props }) => {
    return <div className={joinClassName(["chain-tag", isActive ? 'isActive' : null])} onClick={onClick}>
        <span className="chain-tag__name">{props.name}</span>
        <Chain className="small" {...props} />
    </div>
}
