const getSize = require("term-size");
const stringWidth = require("string-width");
const log = require("log-update");

function munch(str, length, arr = []) {
  if (str) {
    arr.push(str.slice(0, length));
    return munch(str.slice(length), length, arr);
  }

  return arr;
}

function stringToRows(str, { rows, columns }) {
  return str.split(/\r\n|\n|\r/).reduce((chunks, chunk) => {
    if (stringWidth(chunk) > columns)
      return chunks.concat(munch(chunk, columns));
    return chunks.concat(chunk);
  }, []);
}

module.exports = function logger(header, body) {
  const { rows, columns } = getSize();

  const headerChunks = stringToRows(header, { rows, columns });
  const bodyChunks = stringToRows(body, { rows, columns });
  const truncatedBody = bodyChunks
    .slice(-(rows - (headerChunks.length + 2)))
    .join("\n");

  log(`${header}\n\n${truncatedBody}`);
}
