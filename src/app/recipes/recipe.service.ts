import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipes.model";

@Injectable({ providedIn: 'root' })
export class RecipeService {

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Tasty Schnitzel',
    //         'A supre-tasty Schnitzel - just awesome',
    //         'https://previews.123rf.com/images/foodandmore/foodandmore1702/foodandmore170200318/72712598-dish-of-wiener-schnitzel-with-french-fries-sauces-and-vegetable-salad-on-white-background.jpg',
    //         [
    //             new Ingredient('Meat', 1),
    //             new Ingredient('French Fries', 20)
    //         ]),
    //     new Recipe(
    //         'A Big Fat Burger',
    //         'What else you need to say?',
    //         'https://106fyz3cd4vi2lc2uq1tlyl4-wpengine.netdna-ssl.com/wp-content/uploads/2020/09/Moist-Chicken-Burgers.jpg',
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Meat', 1)
    //         ])
    // ];
    private recipes: Recipe[] = [];
    recipesChanged = new Subject<Recipe[]>();

    updateRecipesChanged() {
        this.recipesChanged.next(this.recipes.slice())
    }

    getRecipes() {
        return this.recipes.slice();
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.updateRecipesChanged();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.updateRecipesChanged();
    }

    updateRecipe(newRecipe: Recipe, index: number) {
        this.recipes[index] = newRecipe;
        this.updateRecipesChanged();
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.updateRecipesChanged();
    }
}