import axios from "axios";

export const getRecipeImage: (query: string) => Promise<string> = async (query: string) => {
    const url: string = `https://api.unsplash.com/search/photos`;
    try {
        const response = await axios.get(url,
            {
                params: { query: query },
                headers: { Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}` }
            }
        );

        return response.data.results[0]?.urls?.regular;
    } catch (error) {
        console.error('Error getting recipe image:', error);
        return "";
    }
}