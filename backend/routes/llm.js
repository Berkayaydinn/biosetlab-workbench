const express = require("express");

const router = express.Router();
const { generateWorkflow } = require("../services/aiWorkflowGenerator");

router.post("/workflow/generate", async (req, res) => {
  const prompt = req.body?.prompt;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required.",
    });
  }

  if (process.env.LLM_GENERATION_MODE === "live") {
    try {
      const result = await generateWorkflow(prompt.trim());

      return res.status(200).json({
        success: true,
        prompt: prompt.trim(),
        workflow: result.workflow,
        explanation: result.explanation,
        warnings: result.warnings,
      });
    } catch (error) {
      console.error("LLM workflow generation failed:", error.message);

      return res.status(502).json({
        success: false,
        message: "Workflow generation failed.",
      });
    }
  }

  return res.status(200).json({
    success: true,
    prompt: prompt.trim(),
    workflow: {
      nodes: [
        {
          id: "dataset-1",
          type: "default",
          position: { x: 100, y: 150 },
          data: {
            label: "Load Biomedical Dataset",
          },
        },
        {
          id: "preprocess-1",
          type: "default",
          position: { x: 350, y: 150 },
          data: {
            label: "Preprocess Data",
          },
        },
        {
          id: "classifier-1",
          type: "default",
          position: { x: 600, y: 150 },
          data: {
            label: "Train Classifier",
          },
        },
        {
          id: "evaluation-1",
          type: "default",
          position: { x: 850, y: 150 },
          data: {
            label: "Evaluate Model",
          },
        },
      ],
      edges: [
        {
          id: "edge-1",
          source: "dataset-1",
          target: "preprocess-1",
        },
        {
          id: "edge-2",
          source: "preprocess-1",
          target: "classifier-1",
        },
        {
          id: "edge-3",
          source: "classifier-1",
          target: "evaluation-1",
        },
      ],
    },
    explanation:
      "Mock biomedical classification workflow generated successfully.",
  });
});


const { isAuth } = require("../middlewares/user");
const {
  generateAuthorizedWorkflow
} = require("../services/aiAuthorizedWorkflow");

router.post("/workflow/generate-authorized", isAuth, async (req, res) => {
  try {
    const result = await generateAuthorizedWorkflow({
      prompt: req.body?.prompt,
      datasetId: req.body?.datasetId,
      targetColumn: req.body?.targetColumn,
      userId: req.authanticatedUserId
    });

    return res.status(200).json({
      success: true,
      workflow: result.workflow,
      explanation: result.explanation,
      warnings: result.warnings,
      datasetId: result.datasetId,
      targetColumn: result.targetColumn
    });
  } catch (error) {
    const status = [400, 401, 403, 404].includes(error.statusCode)
      ? error.statusCode
      : 502;

    if (status === 502) {
      console.error(
        "Authorized workflow generation failed:",
        error.message
      );
    }

    return res.status(status).json({
      success: false,
      message: status === 502
        ? "Workflow generation failed."
        : error.message
    });
  }
});


// List datasets the authenticated user is allowed to access.
router.get("/datasets/authorized", isAuth, async (req, res) => {
  try {
    const Project = require("../models/project");
    const Dataset = require("../models/dataset");
    const { canAccessProject } = require("../services/aiDatasetAccess");

    const userId = req.authanticatedUserId;

    const projects = await Project.find({
      $or: [
        { ownerId: userId },
        { userIds: userId },
        { collaboratorIds: userId }
      ]
    }).select("_id name datasetIds ownerId userIds collaboratorIds");

    const authorizedProjects = projects.filter(project =>
      canAccessProject(project, userId)
    );

    const allowed = new Map();

    for (const project of authorizedProjects) {
      for (const id of project.datasetIds || []) {
        allowed.set(String(id), String(project._id));
      }
    }

    const datasets = await Dataset.find({
      _id: { $in: [...allowed.keys()] }
    }).select("_id name projectId extension");

    const safeDatasets = datasets
      .filter(dataset =>
        allowed.get(String(dataset._id)) === String(dataset.projectId)
      )
      .map(dataset => ({
        _id: String(dataset._id),
        name: dataset.name,
        projectId: String(dataset.projectId),
        extension: dataset.extension
      }));

    return res.status(200).json({
      success: true,
      datasets: safeDatasets
    });
  } catch (error) {
    console.error("Authorized dataset listing failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load datasets."
    });
  }
});


// Return column names from an authorized anonymized dataset.
router.get("/datasets/:datasetId/columns", isAuth, async (req, res) => {
  try {
    const {
      getAuthorizedDataset
    } = require("../services/aiDatasetAccess");
    const {
      readDatasetColumns
    } = require("../services/aiDatasetColumns");

    const dataset = await getAuthorizedDataset({
      datasetId: req.params.datasetId,
      userId: req.authanticatedUserId
    });

    const columns = await readDatasetColumns(dataset);

    return res.status(200).json({
      success: true,
      datasetId: String(dataset._id),
      columns
    });
  } catch (error) {
    const status = [400, 401, 403, 404].includes(error.statusCode)
      ? error.statusCode
      : 500;

    return res.status(status).json({
      success: false,
      message: status === 500
        ? "Unable to load dataset columns."
        : error.message
    });
  }
});

module.exports = router;
