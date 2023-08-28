import { Card } from '../Card';

export const Cards = ({ list }) => list.map(platform => {
    return <Card data={platform} key={platform.name} />
})
