const csv = require("csvtojson");
const path = require("path");

module.exports.convertCSVToJSON = async (fileName) => {
  const csvFilePath = path.join(__dirname, "../", `/public/${fileName}.csv`);
  let jsonArray = await csv().fromFile(csvFilePath);
  return jsonArray;
};

module.exports.handleError = (res, error) => {
  if (typeof error === "string") return res.status(400).json({ error });
  return res.status(401).json({ error: error.message });
};
