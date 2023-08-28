import { useState, useEffect } from 'react';
import ColorHash from 'color-hash';

import { Filter } from './components/Filter';
import { Cards } from './components';
import { tagColorsContext } from './hooks/useTagColors/tagColorsContext'

import list from './list.json';

export const App = () => {
    const [filteredList, setFilteredList] = useState(list);
    const [tagColors, setTagColors] = useState({});
    const [chains, setChains] = useState([]);
    const colorHash = new ColorHash({ lightness: [0.8, 0.9] });

    const onUpdateFilter = (filteredList) => setFilteredList(filteredList);

    useEffect(() => {
        const colorsByTag = {};
        const chainList = new Set();
        list.forEach(platform => {
            platform.tags.forEach(tag => {
                if (tag in colorsByTag) return;
                const tagLowerCase = tag.toLowerCase();
                colorsByTag[tagLowerCase] = colorHash.hex(tagLowerCase);
            });
            platform.chains.forEach(chain => chainList.add(chain));
        });
        setTagColors(colorsByTag);
        setChains([...chainList]);
    }, []);

    return (
        <tagColorsContext.Provider value={tagColors}>
            <Filter
                data={list}
                tags={tagColors}
                chains={chains}
                onUpdate={onUpdateFilter}
            />
            <Cards list={filteredList} />
        </tagColorsContext.Provider>
    )
};
