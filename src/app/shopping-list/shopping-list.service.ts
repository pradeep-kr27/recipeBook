import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({ providedIn: 'root' })
export class ShoppingListService {

    editingIngredientId = new Subject<number>();
    ingredientsChanged = new Subject<Ingredient[]>();
    private ingredients: Ingredient[] = [
        new Ingredient('Bread', 5),
        new Ingredient('Onion', 10)
    ];

    getIngredients() {
        return this.ingredients.slice();
    }

    updateIngredientsChanged() {
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredientsFromRecipe(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.updateIngredientsChanged();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.updateIngredientsChanged();
    }

    updateIngredient(newIngredient: Ingredient, index: number) {
        this.ingredients[index] = newIngredient;
        this.updateIngredientsChanged();
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.updateIngredientsChanged();
    }
}