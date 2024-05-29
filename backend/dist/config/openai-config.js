import { Configuration } from "openai";
export const configureOpenAi = () => {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_SECRET,
        organization: process.env.OPENAI_ORGANIZATION_ID,
    });
    return config;
};
//# sourceMappingURL=openai-config.js.map