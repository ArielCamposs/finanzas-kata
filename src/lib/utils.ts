export const utils = {
    // Generate YYYY-MM-DD string for current user's local timezone
    getLocalDateISO: (): string => {
        const now = new Date();
        const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
        return local.toISOString().slice(0, 10);
    },

    // Parse YYYY-MM-DD string as Local Date (midnight) to prevent timezone shifts
    parseLocalDate: (dateString: string): Date => {
        // Appending T00:00:00 ensures local time interpretation in modern browsers
        return new Date(`${dateString}T00:00:00`);
    }
};
