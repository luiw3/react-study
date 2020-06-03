import React, { useReducer , useState, useEffect, useCallback } from 'react';

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
}

function Ingredients() {
  const [ingredientsState, dispatch] = useReducer(ingredientReducer, [])
  // const [ingredientsState, setIngredientsState] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [errorState, setErrorState] = useState();


  useEffect(()=> {
    console.log('RENDERING INGREDIENTS', ingredientsState)
  }, [ingredientsState]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
   dispatch({
     type: 'SET', ingredients: filteredIngredients
   })
  }, [])

  
  const addIngredientHandler = ingredient => {
    setLoadingState(true)
    fetch('https://react-hooks-daa0e.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setLoadingState(false)
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
    setLoadingState(true)
    fetch(`https://react-hooks-daa0e.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then( response => {
      setLoadingState(false)
      // const ing = ingredientsState.filter(ingredients => ingredients.id !== ingredientId);
      // setIngredientsState(ing)
      dispatch({type: 'DELETE', id: ingredientId})
    })
    .catch (error => {
      setErrorState('Something went wrong');
      setLoadingState(false);
    })
  }

  const clearError = () => {
    setErrorState(null);
  }
  return (
    <div className="App">
      {errorState && <ErrorModal onClose={clearError}>{errorState}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={loadingState}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredientsState} onRemoveItem={removeIngredientHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
