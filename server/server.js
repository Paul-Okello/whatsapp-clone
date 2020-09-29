// importing all modules
import express from "express";
import mongoose from "mongoose";

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware
// Database config
const connection_url =
  "mongodb+srv://admin:50279909@Lopoz@cluster0.zidpr.mongodb.net/whatsapp-clone?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// ???
// api routes
app.get("/", (req, res) => res.status(200).send("Hello Whatsapp"));
// listener
app.listen(port, () => console.log(`Listenning on localhost: ${port}`));
