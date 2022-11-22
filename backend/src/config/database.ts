import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI as string, {})
    .then((data) => {
      console.log(
        `Mongo connected with server: ${data.connection.host}: ${data.connection.port}`
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDatabase;
