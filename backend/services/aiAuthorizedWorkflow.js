"use strict";

const {
  getAuthorizedDataset
} = require("./aiDatasetAccess");

const {
  extractDatasetMetadata
} = require("./aiDatasetExtractor");

const {
  generateWorkflow
} = require("./aiWorkflowGenerator");

async function generateAuthorizedWorkflow({
  prompt,
  datasetId,
  targetColumn,
  userId,
  authorizeDataset = getAuthorizedDataset,
  extractMetadata = extractDatasetMetadata,
  generate = generateWorkflow
}) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    const error = new Error("Prompt is required.");
    error.statusCode = 400;
    throw error;
  }

  if (typeof targetColumn !== "string" ||
      !targetColumn.trim()) {
    const error = new Error("Target column is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!userId) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    throw error;
  }

  const dataset = await authorizeDataset({
    datasetId,
    userId
  });

  const metadata = await extractMetadata({
    dataset,
    targetColumn: targetColumn.trim()
  });

  // Exclude identifiers and possible post-diagnosis leakage
  // from model features for this specific research dataset.
  if (dataset.name === "Breast Cancer Patient Data") {
    const excludedColumns = [
      "id",
      "name",
      "email",
      "cancer_stage_at_diagnosis"
    ];

    for (const columnName of excludedColumns) {
      if (metadata.column_info[columnName]) {
        metadata.column_info[columnName].class = "meta";
      }
    }
  }

  // Dataset identity comes from the authorized record,
  // never from a filename supplied by the client.
  const safePrompt = [
    prompt.trim(),
    "",
    "Selected dataset file: " + metadata.file_name,
    "Selected target column: " + targetColumn.trim(),
    "Use the selected dataset file in the File node.",
    "Do not invent another dataset filename."
  ].join("\n");

  const result = await generate(safePrompt, {
    datasetMetadata: metadata
  });

  return {
    workflow: result.workflow,
    explanation: result.explanation,
    warnings: result.warnings,
    datasetId,
    targetColumn: targetColumn.trim()
  };
}

module.exports = {
  generateAuthorizedWorkflow
};
