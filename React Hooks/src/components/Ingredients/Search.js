import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useFetch from '../../hooks/httpHook';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filterState, setFilterState] = useState('');
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useFetch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterState === inputRef.current.value) {
        const query = filterState.length === 0 ? '' : `?orderBy="title"&equalTo="${filterState}"`;
        sendRequest('https://react-hooks-daa0e.firebaseio.com/ingredients.json' + query, 'GET')
      };
    }
      , 500);
    return () => {
      clearTimeout(timer);
    }
  }
    , [filterState, sendRequest, inputRef])

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients])
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading..</span>}
          <input
            ref={inputRef}
            type="text"
            value={filterState}
            onChange={event => setFilterState(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
