// Utility function to generate the correct URL
export const getMediaUrl = (thumbnail: string | undefined, type: string): string | null | any => {
    if (!thumbnail) return null;

    // Check if the thumbnail is already a full URL
    if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
        return thumbnail;
    }

    // If it's a file name, construct the URL
    return `${import.meta.env.VITE_API_IMG_URL}/${type}/${thumbnail}`;
};
