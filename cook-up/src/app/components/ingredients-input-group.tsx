import React from 'react';
import Input, {IInputProps} from "@/app/login/input";
import {UseFormRegister} from "react-hook-form";
import {EIngredientUnit} from "@/app/enums/ingredient-unit.enum";
import {Dropdown, DropdownChangeEvent, DropdownProps} from "primereact/dropdown";
import {IIngredient} from "@server/interfaces/ingredients.interface";
import {Button} from "primereact/button";

export default function IngredientsInputGroup({registerAction }: {registerAction: UseFormRegister<any>}) {
    const [currentIngredients, setCurrentIngredients] = React.useState<IIngredient[]>([{quantity: 0, unit: null, name: ''}]);
    const [isHovered, setIsHovered] = React.useState<boolean[]>([false]);

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

        const updateIsHovered = (index: number, isHovered: boolean) => {
            setIsHovered((prevIsHovered: boolean[]) =>
                prevIsHovered.map((prevIsHovered: boolean, prevIndex: number) => index === prevIndex ? isHovered : prevIsHovered)
            );
        }

        return (<div className="flex justify-start items-center flex-row pl-10" key={index} onMouseEnter={() => updateIsHovered(index, true)} onMouseLeave={() => updateIsHovered(index, false)}>
            <Input inputProps={quantityInputProps} registerAction={registerAction} className="w-14 h-[2.5rem]"></Input>
            <Dropdown value={ingredient.unit} onChange={(e: DropdownChangeEvent) => updateUnit(e)} options={ingredientUnitDropdownProps.options} optionLabel="label"
                      placeholder={ingredientUnitDropdownProps.placeholder} className="w-30 border rounded-md mr-3 ml-3 mt-1 p-inputtext-sm" checkmark={true} highlightOnSelect={false} />
            <Input inputProps={ingredientNameInputProps} registerAction={registerAction} className="w-24 h-[2.5rem]"></Input>
            {isHovered[index] && <Button icon="pi pi-times" rounded outlined severity="danger" size="small" className="p-0 h-4 w-4 mr-2 text-[10px] absolute right-[63%]" type="button" onClick={() => removeIngredient(index)}/>
            }

        </div>)
    };

    const addIngredient = () => {
        setCurrentIngredients([...currentIngredients, {
            quantity: 0,
            unit: null,
            name: ''
        }]);
        setIsHovered([...isHovered, false]);
    }

    const removeIngredient = (index: number) => {
        setCurrentIngredients((prevIngredients: IIngredient[]) =>
            prevIngredients.filter((prevIngredient: IIngredient, prevIndex: number) => index !== prevIndex)
        );
    }

    return (
        <div className="flex justify-start flex-col">
            <style>
                {`
                    .p-button-icon {
                        font-size: 10px;
                      }
                `}
            </style>
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

