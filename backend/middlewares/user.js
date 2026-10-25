const TokenManager = require('../utils/TokenManager');
const Project = require("../models/project");
const tokenManager = new TokenManager();
const mongoose = require('mongoose');
const path = require('path');

const isAuth = async function(req, res, next) {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized."
            });
        }

        const userId = tokenManager.verifyToken(token);

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(401).json({
                message: "Not authorized."
            });
        }

        const User = require("../models/user");

        const user = await User.findById(userId)
            .select("_id verified blocked");

        if (!user || !user.verified || user.blocked) {
            return res.status(401).json({
                message: "Not authorized."
            });
        }

        req.authanticatedUserId = String(user._id);
        return next();

    } catch (error) {
        console.error("Authentication middleware error:", error.message);

        return res.status(500).json({
            message: "Authentication service unavailable."
        });
    }
};

const datasetFolderAccessController = async function(req, res, next) {
    // Reuse the same active-user authentication as the API.
    return isAuth(req, res, async function() {
        try {
            const { getAuthorizedDataset } =
                require("../services/aiDatasetAccess");
            const { resolveDatasetPath } =
                require("../services/aiDatasetExtractor");

            const filename = req.path.slice(1);

            // Only a single filename is accepted.
            if (
                !filename ||
                filename.includes("/") ||
                filename.includes("\\\\") ||
                filename.includes("..")
            ) {
                return res.status(404).json({
                    message: "Dataset not found."
                });
            }

            const match = /^([a-f0-9]{24})-([a-f0-9]{24})\.(csv|json)$/i.exec(filename);

            if (!match) {
                return res.status(404).json({
                    message: "Dataset not found."
                });
            }

            const requestedProjectId = match[1];
            const datasetId = match[2];

            const dataset = await getAuthorizedDataset({
                datasetId,
                userId: req.authanticatedUserId
            });

            if (
                String(dataset.projectId) !== requestedProjectId
            ) {
                return res.status(404).json({
                    message: "Dataset not found."
                });
            }

            const verifiedPath = resolveDatasetPath(dataset);

            if (path.basename(verifiedPath) !== filename) {
                return res.status(404).json({
                    message: "Dataset not found."
                });
            }

            return res.sendFile(verifiedPath);

        } catch (error) {
            if ([400, 401, 403, 404].includes(error.statusCode)) {
                return res.status(404).json({
                    message: "Dataset not found or access denied."
                });
            }

            console.error(
                "Dataset access error:",
                error.message
            );

            return res.status(500).json({
                message: "Dataset access failed."
            });
        }
    });
};

module.exports = { isAuth, datasetFolderAccessController }