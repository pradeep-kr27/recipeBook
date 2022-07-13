import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('shopForm', { static: false }) shoppingListForm: NgForm;
  editingMode = false;
  editingIndex: number;
  editingIngredient: Ingredient;
  subscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.editingIngredientId.subscribe(
      (index: number) => {
        this.editingIndex = index;
        this.editingMode = true;
        this.editingIngredient = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editingIngredient.name,
          amount: this.editingIngredient.amount
        });
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editingMode) this.shoppingListService.updateIngredient(newIngredient, this.editingIndex);
    else this.shoppingListService.addIngredient(newIngredient);
    this.onClear();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editingIndex);
    this.shoppingListForm.reset();
  }

  onClear() {
    this.editingMode = false;
    this.shoppingListForm.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
