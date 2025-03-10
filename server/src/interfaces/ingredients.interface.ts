import {EIngredientUnit} from "@client/app/enums/ingredient-unit.enum";

export interface IIngredient {
    name: string;
    quantity: number;
    unit: EIngredientUnit;
}