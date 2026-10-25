"use strict";

const jwt = require("jsonwebtoken");

class TokenManager {
  constructor() {
    this.secretKey = process.env.JWT_SECRET;

    if (!this.secretKey || this.secretKey.length < 48) {
      throw new Error(
        "JWT_SECRET must be configured and at least 48 characters."
      );
    }

    this.expiresIn = "1y";
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      this.secretKey,
      {
        algorithm: "HS256",
        expiresIn: this.expiresIn
      }
    );
  }

  verifyToken(authorization) {
    if (typeof authorization !== "string") {
      return null;
    }

    const match = /^Bearer ([^\s]+)$/.exec(authorization);

    if (!match) {
      return null;
    }

    try {
      const decoded = jwt.verify(
        match[1],
        this.secretKey,
        { algorithms: ["HS256"] }
      );

      return decoded.userId || null;
    } catch {
      return null;
    }
  }
}

module.exports = TokenManager;
