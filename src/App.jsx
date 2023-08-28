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
    const [filterTags, setFilterTags] = useState({});
    const colorHash = new ColorHash({ lightness: [0.8, 0.9] });

    const onUpdateFilter = (filteredList) => setFilteredList(filteredList);

    const onClickTag = (name) => {
        console.log({name})
    }

    const onClickChain = (name) => {
        console.log({name})
    }

    useEffect(() => {
        const colorsByTag = {};
        const chainList = new Set();
        list.forEach(platform => {
            platform.tags.forEach(tag => {
                const tagLowerCase = tag.toLowerCase();
                if (tagLowerCase in colorsByTag) return;
                colorsByTag[tagLowerCase] = colorHash.hex(tagLowerCase);
            });
            platform.chains.forEach(chain => chainList.add(chain));
        });
        setTagColors(colorsByTag);
        setChains([...chainList]);

        // Collecting ecosystem tags into a single one
        const newFilterTags = Object.keys(colorsByTag).reduce((acc, tag) => {
            if (tag.toLowerCase().search('ecosystem') === -1) acc[tag.toLowerCase()] = null;
            return acc;
        }, {})
        setFilterTags({
            ...newFilterTags,
            ecosystem: null,
        });
    }, []);

    return (
        <tagColorsContext.Provider value={tagColors}>
            <Filter
                data={list}
                tags={filterTags}
                chains={chains}
                onUpdate={onUpdateFilter}
            />
            <Cards
                list={filteredList}
                onClickTag={onClickTag}
                onClickChain={onClickChain}
            />
        </tagColorsContext.Provider>
    )
};
