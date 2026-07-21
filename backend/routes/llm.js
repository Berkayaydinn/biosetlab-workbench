const express = require("express");

const router = express.Router();

router.post("/workflow/generate", (req, res) => {
  const prompt = req.body?.prompt;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required.",
    });
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

module.exports = router;
