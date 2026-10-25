"use strict";

const mongoose = require("mongoose");
const Dataset = require("../models/dataset");
const Project = require("../models/project");

class DatasetAccessError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "DatasetAccessError";
    this.statusCode = statusCode;
  }
}

function containsUser(ids, userId) {
  return Array.isArray(ids) &&
    ids.some(id => String(id) === String(userId));
}

function canAccessProject(project, userId) {
  if (!project || !userId) {
    return false;
  }

  return (
    String(project.ownerId) === String(userId) ||
    containsUser(project.userIds, userId) ||
    containsUser(project.collaboratorIds, userId)
  );
}

async function getAuthorizedDataset({
  datasetId,
  userId,
  DatasetModel = Dataset,
  ProjectModel = Project
}) {
  if (!userId) {
    throw new DatasetAccessError(
      "Authentication required.",
      401
    );
  }

  if (
    typeof datasetId !== "string" ||
    !mongoose.isValidObjectId(datasetId)
  ) {
    throw new DatasetAccessError(
      "Invalid dataset ID.",
      400
    );
  }

  const dataset = await DatasetModel.findById(datasetId);

  if (!dataset || !dataset.projectId) {
    throw new DatasetAccessError(
      "Dataset not found or access denied.",
      404
    );
  }

  const project = await ProjectModel.findById(
    dataset.projectId
  );

  if (
    !project ||
    !canAccessProject(project, userId) ||
    !containsUser(project.datasetIds, dataset._id)
  ) {
    throw new DatasetAccessError(
      "Dataset not found or access denied.",
      404
    );
  }

  return dataset;
}

module.exports = {
  DatasetAccessError,
  canAccessProject,
  getAuthorizedDataset
};
