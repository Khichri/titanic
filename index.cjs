const express = require("express");
const fileUpload = require("express-fileupload");
const Hyperdrive = require("hyperdrive");
const Corestore = require("corestore");
const Hyperswarm = require("hyperswarm");
const cors = require('cors');

const store = new Corestore("./storage");
let drive = new Hyperdrive(store);
const swarm = new Hyperswarm();

let done = () => true;

const app = express();
app.use(cors());
app.use(express.static("./dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get("/api/info", (req, res) => {
  res.send({
    id: drive.id,
    key: drive.key.toString("base64"),
  });
});

app.get("/api/open", (req, res) => {
  const { key } = req.query;
  const buff = Buffer.from(key, "base64");
  drive = new Hyperdrive(store, buff);
  res.send("Ok");
});

app.get("/api/ls", async (req, res) => {
  const stream = drive.list("/");
  const chunks = [];
  stream.on("data", function (chunk) {
    chunks.push(chunk);
  });
  stream.on("end", function () {
    res.send(chunks);
  });
  // stream.pipe(res)
});

app.post("/api/upload", async (req, res) => {
  const { path } = req.query;
  const buff = req.files.uploadedFile.data;
  const name = req.files.uploadedFile.name;

  await drive.put(path + "/" + name, buff);

  res.redirect("/");
});

app.get("/api/del", async (req, res) => {
  const { path } = req.query;
  await drive.clear(path);
  await drive.del(path);
  res.send("Ok");
});

app.get("/api/copy", async (req, res) => {
  const { from, to } = req.query;
  await drive.put(to, await drive.get(from));
  res.send("Ok");
});

app.get("/api/dl", async (req, res) => {
  const { path } = req.query;
  const rs = drive.createReadStream(path);
  rs.pipe(res);
});

const server = app.listen(3000, async () => {
  await drive.ready();
  done = drive.findingPeers();
  swarm.on("connection", (socket) => drive.replicate(socket));
  //   console.log(drive.discoveryKey);
  swarm.join(drive.discoveryKey);
  console.log(`App running on url http://localhost:3000`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  swarm.flush().then(done, done);
  server.close(() => {
    console.log("HTTP server closed");
  });
});
