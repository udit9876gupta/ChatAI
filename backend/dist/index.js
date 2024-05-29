import app from "./app.js";
import connectToDatabase from "./db/connection.js";
const PORT = process.env.PORT || 5000;
//connections
connectToDatabase()
    .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000 and connected to database"));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map