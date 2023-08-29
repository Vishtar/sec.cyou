import { useState, useEffect } from 'react';
import ColorHash from 'color-hash';

import { Filter } from './components/Filter';
import { Cards } from './components';
import { tagColorsContext } from './hooks/useTagColors/tagColorsContext'
import { defaultFilterData } from './components/Filter/consts/defaultFilterData'

import list from './list.json';

export const App = () => {
    const [filteredList, setFilteredList] = useState(list);
    const [tagColors, setTagColors] = useState({});
    const [filterData, setFilterData] = useState(defaultFilterData);
    const [chains, setChains] = useState([]);
    const [filterTags, setFilterTags] = useState({});
    const colorHash = new ColorHash({ lightness: [0.8, 0.9] });

    const onUpdateFilter = (filteredList) => setFilteredList(filteredList);

    const onClickCardFilter = (field, newValue) => {
        setFilterData(prevFilter => {
            // let newValue = value;
            // if (newValue.toLowerCase().search('ecosystem') !== -1) newValue = 'ecosystem'
            return {
                ...defaultFilterData,
                [field]: {
                    [newValue]: true,
                },
            }
        });
    }

    useEffect(() => {
        const colorsByTag = {};
        const chainList = new Set();
        const newFilterTags = {};

        list.forEach(platform => {
            platform.tags.forEach(tag => {
                if (tag.toLowerCase().search('ecosystem') === -1) newFilterTags[tag] = null;
                const tagLowerCase = tag.toLowerCase();
                if (tagLowerCase in colorsByTag) return;
                colorsByTag[tagLowerCase] = colorHash.hex(tagLowerCase);
            });
            platform.chains.forEach(chain => chainList.add(chain));
        });
        setTagColors(colorsByTag);
        setChains([...chainList]);
        setFilterTags({
            ...newFilterTags,
            ecosystem: null,
        });
    }, []);

    return (
        <tagColorsContext.Provider value={tagColors}>
            <Filter
                data={list}
                filterData={filterData}
                tags={filterTags}
                chains={chains}
                onUpdate={onUpdateFilter}
                onUpdateFilter={(data) => setFilterData(data)}
            />
            <Cards
                list={filteredList}
                onClickTag={(value) => onClickCardFilter('tags', value)}
                onClickChain={(value) => onClickCardFilter('chains', value)}
            />
        </tagColorsContext.Provider>
    )
};
