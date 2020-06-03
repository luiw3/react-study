import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [ingredientsState, setIngredientsState] = useState([]);


  useEffect(()=> {
    console.log('RENDERING INGREDIENTS', ingredientsState)
  }, [ingredientsState]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredientsState(filteredIngredients)
  }, [])

  
  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-daa0e.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setIngredientsState(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ]);
    });

  }

  const removeIngredientHandler = ingredientId => {
    const ing = ingredientsState.filter(ingredients => ingredients.id !== ingredientId);
    setIngredientsState(ing)
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredientsState} onRemoveItem={removeIngredientHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
