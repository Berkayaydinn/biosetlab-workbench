"use strict";

const fs = require("node:fs");
const path = require("node:path");
const csv = require("csv-parser");

const DATASET_ROOT = path.resolve(
  __dirname,
  "../anonymdatasets"
);

const MAX_ROWS = 100000;
const MAX_COLUMNS = 500;

function resolveDatasetPath(dataset) {
  if (!dataset || typeof dataset.anonym_url !== "string") {
    throw new Error("Dataset file path is missing.");
  }

  const resolved = path.resolve(
    __dirname,
    "..",
    dataset.anonym_url
  );

  if (
    !resolved.startsWith(DATASET_ROOT + path.sep) ||
    ![".csv", ".json"].includes(
      path.extname(resolved).toLowerCase()
    )
  ) {
    throw new Error("Invalid dataset file path.");
  }

  return resolved;
}

function inferType(values) {
  const nonEmpty = values
    .filter(v => v !== null && v !== undefined)
    .map(v => String(v).trim())
    .filter(v => v !== "" && v !== "?");

  if (nonEmpty.length === 0) return "unknown";

  if (nonEmpty.every(v =>
    /^(true|false|yes|no)$/i.test(v)
  )) {
    return "boolean";
  }

  if (nonEmpty.every(v =>
    v !== "" && Number.isFinite(Number(v))
  )) {
    return "numeric";
  }

  return "categorical";
}

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];

    const stream = fs.createReadStream(filePath)
      .pipe(csv());

    stream.on("headers", value => {
      headers = value;
      if (headers.length > MAX_COLUMNS) {
        stream.destroy(
          new Error("Dataset has too many columns.")
        );
      }
    });

    stream.on("data", row => {
      rows.push(row);

      if (rows.length > MAX_ROWS) {
        stream.destroy(
          new Error("Dataset has too many rows.")
        );
      }
    });

    stream.on("end", () => {
      resolve({ rows, headers });
    });

    stream.on("error", reject);
  });
}

async function readJSON(filePath) {
  const content = await fs.promises.readFile(
    filePath,
    "utf8"
  );

  const parsed = JSON.parse(content);

  if (!Array.isArray(parsed)) {
    throw new Error(
      "JSON dataset must be an array of records."
    );
  }

  if (parsed.length > MAX_ROWS) {
    throw new Error("Dataset has too many rows.");
  }

  const headers = [
    ...new Set(
      parsed.flatMap(row =>
        row && typeof row === "object" &&
        !Array.isArray(row)
          ? Object.keys(row)
          : []
      )
    )
  ];

  if (headers.length > MAX_COLUMNS) {
    throw new Error("Dataset has too many columns.");
  }

  return { rows: parsed, headers };
}

async function extractDatasetMetadata({
  dataset,
  targetColumn
}) {
  if (
    typeof targetColumn !== "string" ||
    !targetColumn.trim()
  ) {
    throw new Error("Target column is required.");
  }

  const filePath = resolveDatasetPath(dataset);

  const stat = await fs.promises.stat(filePath);

  if (!stat.isFile()) {
    throw new Error("Dataset path is not a file.");
  }

  const extension = path.extname(filePath).toLowerCase();

  const { rows, headers } = extension === ".csv"
    ? await readCSV(filePath)
    : await readJSON(filePath);

  if (rows.length === 0 || headers.length < 2) {
    throw new Error("Dataset is empty or invalid.");
  }

  if (new Set(headers).size !== headers.length) {
    throw new Error("Duplicate dataset columns.");
  }

  if (!headers.includes(targetColumn)) {
    throw new Error(
      "Target column does not exist in dataset."
    );
  }

  const column_info = {};

  for (const name of headers) {
    const values = rows.map(row => row[name]);

    column_info[name] = {
      name,
      type: inferType(values),
      class: name === targetColumn
        ? "target"
        : "feature"
    };
  }

  return {
    file_name: path.basename(filePath),
    column_info
  };
}

module.exports = {
  extractDatasetMetadata,
  resolveDatasetPath,
  inferType
};
