// importing all modules
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());
// Database config
const connectionUrl =
  "mongodb+srv://admin:hzgzH7Sxz5o5zESv@cluster0.zidpr.mongodb.net/whatsappDb?retryWrites=true&w=majority";

mongoose.connect(connectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ???
// api routes
app.get("/", (req, res) => res.status(200).send("Hello Whatsapp"));

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// listener
app.listen(port, () => console.log(`Listenning on localhost: ${port}`));
