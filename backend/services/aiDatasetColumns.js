"use strict";

const fs = require("node:fs");
const path = require("node:path");
const csv = require("csv-parser");
const { resolveDatasetPath } = require("./aiDatasetExtractor");

async function readDatasetColumns(dataset) {
  const filePath = resolveDatasetPath(dataset);
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".json") {
    const content = await fs.promises.readFile(filePath, "utf8");
    const rows = JSON.parse(content);

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("Invalid JSON dataset.");
    }

    const columns = [...new Set(
      rows.flatMap(row =>
        row && typeof row === "object" && !Array.isArray(row)
          ? Object.keys(row)
          : []
      )
    )];

    if (columns.length < 2 || columns.length > 500) {
      throw new Error("Invalid dataset columns.");
    }

    return columns;
  }

  if (extension === ".csv") {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath)
        .pipe(csv());

      stream.once("headers", columns => {
        stream.destroy();

        if (
          columns.length < 2 ||
          columns.length > 500 ||
          new Set(columns).size !== columns.length
        ) {
          return reject(new Error("Invalid dataset columns."));
        }

        resolve(columns);
      });

      stream.once("error", reject);
    });
  }

  throw new Error("Unsupported dataset format.");
}

module.exports = { readDatasetColumns };
