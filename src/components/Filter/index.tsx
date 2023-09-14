import { useEffect, Dispatch } from 'react';
import fuzzysort from 'fuzzysort';
import { Tag, ChainTag } from '../';
import { toogleTrueOrDeleteByObjectKey } from '../../helpers/toogleTrueOrDeleteByObjectKey'
import { useFilter, defaultFilter, Filter as FilterType } from '../../contexts/filter'
import { getFilterFromUrl, sendFilterToUri } from './helpers'
import { Platform } from '../../list'

import './style.css';

type FilterProps = {
    data: Platform[];
    tags: Set<string>;
    chains: Set<string>;
    onUpdate: Dispatch<Platform[]>;
}

export const Filter = ({ data, tags, chains, onUpdate }: FilterProps) => {
    const [ filter, setFilter ] = useFilter();

    const onChangeFilter = (field: keyof FilterType, updatedValue: any) => {
        // @ts-ignore
        // TODO
        const newValue = field === 'text'
            ? updatedValue
            : toogleTrueOrDeleteByObjectKey(filter[field], updatedValue)
        setFilter({
            ...filter,
            [field]: newValue
        });
    }

    const onReset = () => setFilter(defaultFilter);

    useEffect(() => {
        if (!filter) return;

        let filtered: Platform[] = data.slice();

        const filteredTags = Array.from(filter.tags);
        if (filteredTags.length)
            filtered = filtered.filter(
                (platform: Platform) => filteredTags.some(filteredTag => {
                    // TODO
                    // if (filteredTag === 'ecosystem')
                    //     return Array.from(platform.tags).some((tag: string) => (tag.search('ecosystem') !== -1) as boolean);
                    return platform.tags.includes(filteredTag as any);
            }));

        const filteredChains = Object.keys(filter.chains);
        if (filteredChains.length)
            filtered = filtered.filter(
                platform => filteredChains.some(
                    filteredChain => platform.chains.includes(filteredChain as any)))

        if (filter.text) {
            const fuzzyResult = fuzzysort.go(filter.text, filtered, { keys: ['name', 'description', 'website'] });
            if (fuzzyResult)
                filtered = fuzzyResult.map(fuzziedObj => fuzziedObj.obj)
        }

        sendFilterToUri({ filteredTags, filteredChains });
        onUpdate(filtered);
    }, [filter]);

    useEffect(() => {
        const initFilterData = {
            ...getFilterFromUrl({ tags, chains }),
            text: ""
        };

        setFilter(initFilterData || defaultFilter);
    }, [])

    if (!filter) return null;

    return <div id="filter">
        <div className="search-tags">
            <div className="tags">
                {Object.keys(tags).map(tagName =>
                    <Tag
                        isActive={filter.tags.has(tagName)}
                        isFiltered={!!filter.tags.size}
                        key={tagName}
                        onClick={() => onChangeFilter('tags', tagName)}
                    >{tagName}</Tag>
                )}
            </div>
        </div>
        <div className="search-chains">
            <div className='chains'>
                {Array.from(chains).map((chainName: string) =>
                    <ChainTag
                        isActive={filter.chains.has(chainName)}
                        isFiltered={!!filter.chains.size}
                        name={chainName}
                        onClick={() => onChangeFilter('chains', chainName)}
                        key={chainName}
                    />
                )}
            </div>
        </div>
        {Object.keys(filter.tags).length || Object.keys(filter.chains).length || filter.text
            ? <span id="clear-filter" onClick={onReset}>[reset]</span>
            : null
        }
        <div id="filter-input-container">
          <input
            id="filter-input"
            placeholder="Search Platforms..."
            value={filter.text}
            onChange={event => onChangeFilter('text', event.target.value)}
          />
        </div>
    </div>
}
