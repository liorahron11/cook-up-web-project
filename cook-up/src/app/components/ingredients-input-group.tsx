import React from 'react';
import Input, {IInputProps} from "@/app/login/input";
import {UseFormRegister} from "react-hook-form";
import {EIngredientUnit} from "@/app/enums/ingredient-unit.enum";
import {Dropdown, DropdownChangeEvent, DropdownProps} from "primereact/dropdown";
import {IIngredient} from "@server/interfaces/ingredients.interface";
import {Button} from "primereact/button";

export default function IngredientsInputGroup({registerAction }: {registerAction: UseFormRegister<any>}) {
    const [currentIngredients, setCurrentIngredients] = React.useState<IIngredient[]>([]);

    const quantityInputProps: IInputProps = {
        id: 'quantity',
        type: 'number',
        placeholder: 'כמות',
        defaultValue: 0,
        onChange: () => {}
    }

    const ingredientOptions = Object.values(EIngredientUnit).map((unit) => ({
        label: unit,
        value: unit,
    }));

    const ingredientUnitDropdownProps: DropdownProps = {
        placeholder: 'יחידות מידה',
        options: ingredientOptions,
        onChange: (selectedOption: { value: EIngredientUnit }) => {
            console.log('יחידת מידה שנבחרה:', selectedOption);
        }
    };

    const ingredientNameInputProps: IInputProps = {
        id: 'ingredientName',
        type: 'text',
        onChange: () => {},
        placeholder: 'שם המצרך'
    }

    const ingredientUnitInputs: (ingredient: IIngredient, index: number) => any = (ingredient: IIngredient, index: number) => {
        const updateUnit = (e: DropdownChangeEvent) => {
            setCurrentIngredients((prevIngredients: IIngredient[]) =>
                prevIngredients.map((prevIngredient: IIngredient, prevIndex: number) => index === prevIndex ? {...prevIngredient, unit: e.value} : prevIngredient)
            );
        }

        return (<div className="flex justify-start items-center flex-row" key={index}>
            <Input inputProps={quantityInputProps} registerAction={registerAction} className="w-14 h-[2.5rem]"></Input>
            <Dropdown value={ingredient.unit} onChange={(e: DropdownChangeEvent) => updateUnit(e)} options={ingredientUnitDropdownProps.options} optionLabel="label"
                      placeholder={ingredientUnitDropdownProps.placeholder} className="w-30 border rounded-md mr-3 ml-3 mt-1 p-inputtext-sm" checkmark={true} highlightOnSelect={false} />
            <Input inputProps={ingredientNameInputProps} registerAction={registerAction} className="w-24 h-[2.5rem]"></Input>
        </div>)
    };

    const addIngredient = () => {
        setCurrentIngredients([...currentIngredients, {
            quantity: 0,
            unit: null,
            name: ''
        }]);
    }

    return (
        <div className="flex justify-start flex-col">
            <div className="flex justify-start items-center flex-row gap-3 pb-2">
                <label className= "block text-sm font-medium text-gray-700 dark:text-white">מצרכים</label>
                <Button label="הוסף" rounded outlined onClick={() => addIngredient()} type="button" className="h-[0.5rem] text-sm" />
            </div>
            {currentIngredients.map((ingredient: IIngredient, index: number) => {
                    return ingredientUnitInputs(ingredient, index);
            })}
        </div>
        );
};

