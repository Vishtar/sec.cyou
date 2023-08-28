import { useTagColors } from '../../hooks/useTagColors';
import { joinClassName } from '../../helpers/joinClassName';

import './style.css';

export const Tag = ({ isActive, onClick, children }) => {
    const tagColors = useTagColors()

    return (
        <span
            className={joinClassName(['tag', isActive ? 'isActive' : null])}
            style={{
                backgroundColor: tagColors[children.toLowerCase()]
            }}
            onClick={onClick}
        >
            {children}
        </span>
    )
}
