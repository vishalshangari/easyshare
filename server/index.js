// Node
require("dotenv").config();
const path = require("path");

// Routing & middleware
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");

// File handling and uploading
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

// Templating
const exphbs = require("express-handlebars");

// Firebase
const db = require("./db");

// Services
const generateUniquePathname = require("./services/generateUniquePathname");

// Config
const isDev = process.env.NODE_ENV == "development";
const port = process.env.PORT || 4000;
const numCPUs = require("os").cpus().length;
const faviconURL = `https://easyshare-v1.s3-us-west-1.amazonaws.com/favicon.ico`;

// Configure AWS
AWS.config = new AWS.Config({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_BUCKET_REGION,
});

const s3 = new AWS.S3();

// Configure multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: async (req, file, cb) => {
      const key = await generateUniquePathname();
      const keyWithOriginalFileExtension =
        key + file.originalname.substr(file.originalname.lastIndexOf("."));
      req.key = key;
      req.keyWithOriginalFileExtension = keyWithOriginalFileExtension;
      cb(null, keyWithOriginalFileExtension);
    },
  }),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Handlebars templating
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Priority serve upload API route
app.post("/api/upload", upload.single("image"), async (req, res) => {
  const { key: easyShareKey, keyWithOriginalFileExtension } = req;
  const awsURL = `https://${process.env.S3_BUCKET_NAME}.s3-${process.env.S3_BUCKET_REGION}.amazonaws.com/${keyWithOriginalFileExtension}`;
  if (!(easyShareKey && keyWithOriginalFileExtension)) {
    // Send server error
    res.sendStatus(500);
  } else {
    await db.collection("pathnames").doc(easyShareKey).set({
      awsURL: awsURL,
    });
    res.send({ key: easyShareKey });
  }
});

// Main route for serving images
app.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  // Check firebase for existence of key
  const pathRef = db.collection("pathnames").doc(id);
  const doc = await pathRef.get();

  if (!doc.exists || !doc.data()) {
    // No key or data
    return next();
  }

  // Serve AWS URL if key+image exist
  const data = doc.data();
  let helpers;
  if (data) {
    helpers = {
      loadSuccess: true,
      loadFailure: false,
      imgSrc: data.awsURL,
      easyShareKey: id,
      faviconURL: faviconURL,
    };
  } else {
    helpers = {
      loadSuccess: false,
      loadFailure: true,
      imgSrc: "",
      easyShareKey: "Something went wrong! - easyshare",
      faviconURL: faviconURL,
    };
  }
  res.render("image", helpers);
});

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../client/build")));

// All remaining requests return the React app, so React Router can handle forwarding.
app.get("*", (req, res) => {
  if (isDev) {
    res.redirect("/");
  } else {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
