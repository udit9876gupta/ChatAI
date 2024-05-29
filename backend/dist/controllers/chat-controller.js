import User from "../models/User.js";
import { configureOpenAi } from "../config/openai-config.js";
import { OpenAIApi } from "openai";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .json({ message: "User not registered or token malfunctioned" });
        }
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ role: "user", content: message });
        const config = configureOpenAi();
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        const { data } = chatResponse;
        const { content } = data.choices[0].message;
        user.chats.push({ role: "assistant", content });
        await user.save();
        return res.status(200).json({ message: "Success", data: content });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", because: err.message });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        // console.log(name, email, password);
        if (!user) {
            return res.status(401).send("User not Found or Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "Success", chats: user.chats });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR", because: err.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        // console.log(name, email, password);
        if (!user) {
            return res.status(401).send("User not Found or Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "Success" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR", because: err.message });
    }
};
//# sourceMappingURL=chat-controller.js.map