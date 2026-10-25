"use strict";

function isPlainObject(value) {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);
}

function applyDatasetMetadata(workflow, datasetMetadata) {
  if (!isPlainObject(workflow) ||
      !Array.isArray(workflow.nodes) ||
      !Array.isArray(workflow.edges)) {
    throw new Error("Invalid workflow.");
  }

  if (!isPlainObject(datasetMetadata) ||
      typeof datasetMetadata.file_name !== "string" ||
      !datasetMetadata.file_name ||
      !isPlainObject(datasetMetadata.column_info)) {
    throw new Error("Verified dataset metadata is required.");
  }

  const columns = datasetMetadata.column_info;
  const entries = Object.entries(columns);

  if (entries.length < 2) {
    throw new Error("Dataset must contain target and feature columns.");
  }

  const validTypes = new Set([
    "categorical", "numeric", "boolean",
    "text", "date", "unknown"
  ]);

  const validClasses = new Set(["feature", "target", "meta"]);

  for (const [columnName, info] of entries) {
    if (!columnName ||
        !isPlainObject(info) ||
        info.name !== columnName ||
        !validTypes.has(info.type) ||
        !validClasses.has(info.class)) {
      throw new Error(`Invalid metadata for column: ${columnName}`);
    }
  }

  const targets = entries.filter(([, info]) =>
    info.class === "target"
  );

  const features = entries.filter(([, info]) =>
    info.class === "feature"
  );

  if (targets.length !== 1 || features.length === 0) {
    throw new Error(
      "Dataset requires exactly one target and at least one feature."
    );
  }

  let matchedFiles = 0;

  const nodes = workflow.nodes.map(node => {
    if (node.type !== "node-data-file") {
      return node;
    }

    if (node.parameters?.file_name !== datasetMetadata.file_name) {
      throw new Error("Generated dataset filename does not match metadata.");
    }

    matchedFiles++;

    return {
      ...node,
      parameters: {
        ...node.parameters,
        column_info: JSON.parse(JSON.stringify(columns))
      }
    };
  });

  if (matchedFiles !== 1) {
    throw new Error(
      "Expected exactly one matching File node in this workflow."
    );
  }

  return {
    ...workflow,
    nodes
  };
}

module.exports = { applyDatasetMetadata };
