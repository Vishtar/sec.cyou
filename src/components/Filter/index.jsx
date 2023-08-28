import { useState, useEffect } from 'react';
import fuzzysort from 'fuzzysort';
import { Tag, ChainTag } from '../';
import { toogleTrueOrDeleteByObjectKey } from '../../helpers/toogleTrueOrDeleteByObjectKey'

import './style.css';

export const Filter = ({ data, tags, chains, onUpdate }) => {
    const [filterTags, setFilterTags] = useState({});
    const [filterChains, setFilterChains] = useState({});
    const [filterText, setFilterText] = useState('');

    const onClickTag = (tagName) => {
        setFilterTags(prevFilterTags => toogleTrueOrDeleteByObjectKey(prevFilterTags, tagName));
    }

    const onClickChain = (chainName) => {
        setFilterChains(prevFilterChains => toogleTrueOrDeleteByObjectKey(prevFilterChains, chainName));
    }

    const onReset = () => {
        setFilterTags({});
        setFilterChains({});
        setFilterText('');
    }

    useEffect(() => {
        let filtered = data;

        const filteredTags = Object.keys(filterTags);
        if (filteredTags.length) filtered = filtered.filter(platform => filteredTags.some(filteredTag => {
            if (filteredTag.search('ecosystem') !== -1)
                return platform.tags.some(tag => tag.search('ecosystem') !== -1);
            return platform.tags.includes(filteredTag)
        }));

        const filteredChains = Object.keys(filterChains);
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
            <div className="tags">
                {Object.keys(tags).map(tagName =>
                    <Tag
                        isActive={filterTags[tagName]}
                        isFiltered={Object.keys(filterTags).length}
                        key={tagName}
                        onClick={() => onClickTag(tagName)}
                    >{tagName}</Tag>
                )}
            </div>
        </div>
        <div className="search-chains">
            <div className='chains'>
                {chains.map(chainName =>
                    <ChainTag
                        isActive={filterChains[chainName]}
                        isFiltered={Object.keys(filterChains).length}
                        name={chainName}
                        onClick={() => onClickChain(chainName)}
                        key={chainName}
                    />
                )}
            </div>
        </div>
        {Object.keys(filterTags).length || Object.keys(filterChains).length || filterText
            ? <span id="clear-filter" onClick={onReset}>[reset]</span>
            : null
        }
    </div>
}
