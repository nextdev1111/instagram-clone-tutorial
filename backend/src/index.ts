import dotenv from "dotenv";
import app from "./app";
import connectDatabase from "./config/database";

dotenv.config();

// env variables
const PORT = process.env.PORT || 5000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);
});
