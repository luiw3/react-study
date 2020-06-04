import React, { useReducer , useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredient, action.ingredient]
    case 'DELETE':
      return currentIngredient.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!')
  }
};

const httpReducer = (prevHttpState, action) => {
  switch (action.type){
    case 'SEND':
      return { loading: true, error: null};
    case 'RESPONSE':
      return {...prevHttpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.error};
    case 'CLEAR':
      return {...prevHttpState, error: null};
    default:
      throw new Error('Should not get there!')
  }
}

function Ingredients() {
  const [ingredientsState, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
  // const [ingredientsState, setIngredientsState] = useState([]);
  // const [loadingState, setLoadingState] = useState(false);
  // const [errorState, setErrorState] = useState();


  useEffect(()=> {
    console.log('RENDERING INGREDIENTS', ingredientsState)
  }, [ingredientsState]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
   dispatch({
     type: 'SET', ingredients: filteredIngredients
   })
  }, [])

  
  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'})
    fetch('https://react-hooks-daa0e.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})
      return response.json();
    }).then(responseData => {
      // setIngredientsState(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ]);
      dispatch({
        type: 'ADD',
        ingredient: {id: responseData.name, ...ingredient}
      })
    });

  }

  const removeIngredientHandler = ingredientId => {
    dispatchHttp({type:'SEND'})
    fetch(`https://react-hooks-daa0e.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then( response => {
      dispatchHttp({type: 'RESPONSE'})
      // const ing = ingredientsState.filter(ingredients => ingredients.id !== ingredientId);
      // setIngredientsState(ing)
      dispatch({type: 'DELETE', id: ingredientId})
    })
    .catch (error => {
      dispatchHttp({type:'ERROR', error: error.message})
    })
  }

  const clearError = () => {
    dispatchHttp({type: 'CLEAR'})
  }
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredientsState} onRemoveItem={removeIngredientHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
