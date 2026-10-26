const {
  validateCatalogReferences
} = require("../services/aiWorkflowGenerator");

describe("AI Workflow Cycle Validation", () => {
  const createNode = (id) => ({
    id,
    type: "node-transform-impute",
    parameters: {}
  });

  const createEdge = (source, target) => ({
    source,
    target,
    sourceHandle: "data",
    targetHandle: "data"
  });

  test("accepts a valid acyclic workflow", () => {
    const workflow = {
      nodes: [
        createNode("A"),
        createNode("B"),
        createNode("C")
      ],
      edges: [
        createEdge("A", "B"),
        createEdge("B", "C")
      ]
    };

    expect(
      validateCatalogReferences(workflow)
    ).toBe(workflow);
  });

  test("rejects a directed cycle", () => {
    const workflow = {
      nodes: [
        createNode("A"),
        createNode("B"),
        createNode("C")
      ],
      edges: [
        createEdge("A", "B"),
        createEdge("B", "C"),
        createEdge("C", "A")
      ]
    };

    expect(() =>
      validateCatalogReferences(workflow)
    ).toThrow(/cycle/i);
  });

  test("rejects a self-loop", () => {
    const workflow = {
      nodes: [createNode("A")],
      edges: [createEdge("A", "A")]
    };

    expect(() =>
      validateCatalogReferences(workflow)
    ).toThrow(/cycle/i);
  });

  test("rejects a cycle in a disconnected component", () => {
    const workflow = {
      nodes: [
        createNode("A"),
        createNode("B"),
        createNode("C"),
        createNode("D")
      ],
      edges: [
        createEdge("A", "B"),
        createEdge("C", "D"),
        createEdge("D", "C")
      ]
    };

    expect(() =>
      validateCatalogReferences(workflow)
    ).toThrow(/cycle/i);
  });

  test("accepts branching without a cycle", () => {
    const workflow = {
      nodes: [
        createNode("A"),
        createNode("B"),
        createNode("C"),
        createNode("D")
      ],
      edges: [
        createEdge("A", "B"),
        createEdge("A", "C"),
        createEdge("B", "D"),
        createEdge("C", "D")
      ]
    };

    expect(
      validateCatalogReferences(workflow)
    ).toBe(workflow);
  });
});
