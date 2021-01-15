const randomWords = require("random-words");

const db = require("../db");

const formatWord = (word) => {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1);
};

const generate = () => {
  let words = randomWords({
    exactly: 3,
    formatter: formatWord,
  });
  return words.join("");
};

module.exports = async () => {
  let newPathname;
  let pathDoc;
  do {
    newPathname = generate();
    const pathnameRef = db.collection("pathnames").doc(newPathname);
    pathDoc = await pathnameRef.get();
  } while (pathDoc.exists);
  return newPathname;
};
