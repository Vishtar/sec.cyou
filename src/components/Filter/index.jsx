import { useState, useEffect } from 'react';
import fuzzysort from 'fuzzysort';
import { Tag, ChainTag } from '../';
import { toogleBooleanByObjectKey } from '../../helpers/toogleBooleanByObjectKey'

import './style.css';

export const Filter = ({ data, tags, chains, onUpdate }) => {
    const [filterTags, setFilterTags] = useState({});
    const [filterChains, setFilterChains] = useState({});
    const [filterText, setFilterText] = useState('');

    const onClickTag = (tagName) => {
        setFilterTags(prevFilterTags => toogleBooleanByObjectKey(prevFilterTags, tagName));
    }

    const onClickChain = (chainName) => {
        setFilterChains(prevFilterChains => toogleBooleanByObjectKey(prevFilterChains, chainName));
    }

    const onReset = () => {
        setFilterTags({});
        setFilterChains({});
        setFilterText('');
    }

    useEffect(() => {
        let filtered = data;

        const filteredTags = Object.keys(filterTags).filter(filterTag => filterTags[filterTag]);
        if (filteredTags.length) filtered = filtered.filter(platform => filteredTags.some(filteredTag => platform.tags.includes(filteredTag)))

        const filteredChains = Object.keys(filterChains).filter(filterChain => filterChains[filterChain]);
        if (filteredChains.length) filtered = filtered.filter(platform => filteredChains.some(filteredChain => platform.chains.includes(filteredChain)))

        if (filterText) {
            const fuzzyResult = fuzzysort.go(filterText, filtered, { keys: ['name', 'description'] });
            if (fuzzyResult) filtered = fuzzyResult.map(fuzziedObj => fuzziedObj.obj)
        }

        onUpdate(filtered);
    }, [filterTags, filterText, filterChains]);

    return <div id="filter">
        <input
            placeholder="Search by Name or Description"
            value={filterText}
            onChange={event => setFilterText(event.target.value)}
        />
        <div className="search-tags">
            <span>Filtering by tags:</span>
            <div className="tags">
                {Object.keys(tags).map(tagName =>
                    <Tag
                        isActive={filterTags[tagName]}
                        key={tagName}
                        onClick={() => onClickTag(tagName)}
                    >{tagName}</Tag>
                )}
            </div>
        </div>
        <div className="search-chains">
            <span>Filtering by chains:</span>
            <div className='chains'>
                {chains.map(chainName =>
                    <ChainTag
                        isActive={filterChains[chainName]}
                        name={chainName}
                        onClick={() => onClickChain(chainName)}
                        key={chainName}
                    />
                )}
            </div>
        </div>
        <span id="clear-filter" onClick={onReset}>[reset]</span>
    </div>
}
