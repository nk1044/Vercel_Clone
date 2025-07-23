

export const parseUrl = (name: string) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl) {
            throw new Error("Base URL is not defined in environment variables.");
        }
        const parsedUrl = name+"."+baseUrl;
        return parsedUrl;
    } catch (error) {
        console.log("Error parsing URL:", error);
        return null;
    }
}