export default {
    ConvertDateToMilliseconds(timestamp: string): number {
        return new Date(timestamp).getTime();
    },
};