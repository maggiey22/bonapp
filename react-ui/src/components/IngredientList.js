import React from 'react';
import Ingredient from './Ingredient';

function IngredientList(props) {
    return (
        <div>
        {props.ingredients.map((ingredient) =>
            <Ingredient id={ingredient.id} key={ingredient.id} ingredient={ingredient} deleteIngredient={props.deleteIngredient} />
        )}
        </div>
    );
}

export default IngredientList;
