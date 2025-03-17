export const extractProfilePicture = (input: string): string => {
    if (input) {
        const match = input.match(/profilePicture\-[\w\-]+\.\w{3,4}/);
        return match ? match[0] : '';
    }

    return '';
};

export const extractRecipeImage = (input: string): string => {
    if (input) {
        const match = input.match(/photo\-[\w\-]+\.\w{3,4}/);
        return match ? match[0] : '';
    }

    return '';
};