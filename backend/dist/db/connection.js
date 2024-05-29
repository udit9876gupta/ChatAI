import { connect, disconnect } from "mongoose";
export default async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB_URL);
    }
    catch (err) {
        console.log(err);
        throw new Error("Cannot connect to database");
    }
}
async function disconnectFromDatabase() {
    try {
        await disconnect();
    }
    catch (err) {
        console.log(err);
        throw new Error("Cannot disconnect from database");
    }
}
export { connectToDatabase, disconnectFromDatabase };
//# sourceMappingURL=connection.js.map