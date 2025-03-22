import {GenerateContentResult, GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {IRecipe} from "../interfaces/recipe.interface";
import NodeCache from "node-cache";
import {getRecipeImage} from "./unsplash-queries";
import {addNewRecipe} from "./recipe-queries";
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export const generateRecipes = async (): Promise<IRecipe[]> => {
    const cachedData: IRecipe[] = getCachedResponse();
    if (cachedData) {
        return cachedData;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt: string = getRecipesPrompt();

    try {
        const result: GenerateContentResult = await model.generateContent(prompt);

        const match: RegExpMatchArray = result.response.text().match(/```json([\s\S]*?)```/);
        if (match) {
            const jsonString: string = match[1].trim();
            let recipes: IRecipe[] = JSON.parse(jsonString);
            recipes = await attachExtraInfo(recipes);

            for (const recipe of recipes) {
                recipe.isAI = true;
                await addNewRecipe(recipe);
            }
            cacheGeminiResponse(`recipes`, recipes);

            return recipes;
        }
    } catch (e) {
        console.error(e);
        return [];
    }
}

const cacheGeminiResponse: (cacheKey: string, aiRecipes: IRecipe[]) => void = (cacheKey: string, aiRecipes: IRecipe[]) => {
    cache.set(cacheKey, aiRecipes);
}

const getCachedResponse: () => IRecipe[] = () => {
    const cacheKey = `recipes`;
    const cachedResponse: IRecipe[] = cache.get(cacheKey);

    if (cachedResponse) {
        console.log("Serving from cache");
        return cachedResponse;
    }

    return null;
}

const getRecipesPrompt: () => string = () => {
    return  "כתוב רשימה של 5 מתכונים מקצועית ויסודית . המתכונים צריכים להיות בעברית, מפורטים ומותאמים לקהל של טבחים מקצועיים. בצע את ההנחיות הבאות:\n" +
        "\n" +
        "**1. פורמט JSON:**\n" +
        "   המתכון חייב להיות בפורמט JSON תקני.\n" +
        "\n" +
        "**2. מבנה ה-JSON:**\n" +
        "   הקפד על המבנה הבא של ה-JSON:\n" +
        "\n" +
        "   ```json\n" +
        "   {\n" +
        "    \"timestamp\": Date;\n" +
        "    \"title\": string;\n" +
        "    \"description\": string\n" +
        "    \"ingredients\": IIngredient[];\n" +
        "    \"instructions\": string;\n" +
        "    \"image\": string;\n" +
        "  }\n" +
        "\n" +
        "IIngredient {\n" +
        "    name: string;\n" +
        "    quantity: number;\n" +
        "    unit: EIngredientUnit;\n" +
        "}\n" +
        "\n" +
        "EIngredientUnit {\n" +
        "    GRAM = \"גרם\",\n" +
        "    KILOGRAM = \"קילוגרם\",\n" +
        "    MILLILITER = \"מיליליטר\",\n" +
        "    LITER = \"ליטר\",\n" +
        "    TEASPOON = \"כפית\",\n" +
        "    TABLESPOON = \"כף\",\n" +
        "    CUP = \"כוס\",\n" +
        "    PIECE = \"יחידה\",\n" +
        "}\n" +
        "```\n" +
        "\n" +
        "**3. פירוט המרכיבים:**\n" +
        "   * ציין את שמות המרכיבים בצורה ברורה ומדוייקת.\n" +
        "   * ציין כמויות מדויקות (למשל: 250 גרם, 1 כפית, 1/4 כוס).\n" +
        "   * ציין יחידות מידה ברורות (למשל: גרם, כפית, כוס, כף, מ\"ל).\n" +
        "   * הוסף הערות על המרכיבים לפי הצורך (למשל: \"שמנת מתוקה 38%\", \"בצל לבן קצוץ דק\", \"אורז בסמטי מובחר\").\n" +
        "\n" +
        "**4. הוראות הכנה מפורטות:**\n" +
        "   * חלק את תהליך ההכנה לשלבים ברורים ומסודרים.\n" +
        "   * תאר כל שלב בפירוט רב ככל האפשר.\n" +
        "   * ציין טכניקות בישול ספציפיות (למשל: הקפצה, הקרמה, טיגון עמוק).\n" +
        "   * ציין טמפרטורות בישול מדויקות (למשל: 180 מעלות צלזיוס).\n" +
        "   * ציין זמני בישול מדוייקים (למשל: 30 דקות, עד להזהבה).\n" +
        "   * הוסף הערות מיוחדות לכל שלב (למשל: \"יש לערבב כל הזמן\", \"להקפיד לא לשרוף\").\n" +
        "   * הוסף ירידת שורה לאחר כל שלב.\n" +
        "\n" +
        "**5. דוגמה:**\n" +
        "   במידת האפשר, תוכל להשתמש במתכון קיים כבסיס ליצירת הפורמט.\n" +
        "\n" +
        "**6. מצרכים:**\n" +
        "השתמש ב-ENUM הנתון EIngredientUnit על מנת לציין את יחידות המידה של המצרכים. השתמש בערך באנגלית לפי ה-ENUM.\n" +
        "\n" +
        "**6. תמונה:**\n" +
        "   תוסיף תיאור לתמונה לצורך חיפוש באמצעות שירות UNSPLASH. על התיאור להיות באנגלית בשתי מילים או שלושה לכל היותר. הימנע ממילה אחת שיכולה ליצור בלבול כמו למשל - FISH שיתן תמונה של דג ולא של מנה\n" +
        "\n" +
        "**7. בקשה:**\n" +
        "התחל עכשיו ביצירת המתכונים בפורמט JSON על פי ההנחיות המפורטות לעיל.\n" +
        "\n" + "תכתוב רק את ה-JSON ללא תוספות בשביל שאוכל להשתמש ב-JSON.parse";
}

const attachExtraInfo: (recipes: IRecipe[]) => Promise<IRecipe[]> = async (recipes: IRecipe[]): Promise<IRecipe[]> => {
    const cookUpUserID: string = '67de9d445953bd0bebd85b72';

    return Promise.all(
        recipes.map(async (recipe: IRecipe) => {
            const recipeImage: string = await getRecipeImage(recipe.image);

            return { ...recipe, image: recipeImage, senderId: cookUpUserID, comments: [] };
        })
    );
};