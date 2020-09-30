// importing all modules
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
// app config
const app = express();
const port = process.env.PORT || 9000;

// Pusher
const pusher = new Pusher({
  appId: "1082342",
  key: "c849a85ddc8a40a66142",
  secret: "cea3ababb0437b59377f",
  cluster: "ap2",
  encrypted: true,
});

// middleware
app.use(express.json());
app.use(cors());

// Database config
const connectionUrl =
  "mongodb+srv://admin:hzgzH7Sxz5o5zESv@cluster0.zidpr.mongodb.net/whatsappDb?retryWrites=true&w=majority";

mongoose.connect(connectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

// api routes
app.get("/", (req, res) => res.status(200).send("Hello Whatsapp"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data); //Downloading data
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data); // Creating data
    }
  });
});

// listener
app.listen(port, () => console.log(`Listenning on localhost: ${port}`));
