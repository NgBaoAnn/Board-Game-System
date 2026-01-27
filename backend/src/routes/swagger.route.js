const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../configs/swagger.config");
const authService = require("../services/auth.service");
const path = require("path");

// Session store for authenticated users
const authenticatedSessions = new Map();

// Generate simple session token
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Middleware to check docs authentication
const docsAuthMiddleware = (req, res, next) => {
  const sessionToken = req.cookies?.docs_session;

  if (sessionToken && authenticatedSessions.has(sessionToken)) {
    return next();
  }

  // Redirect to login page
  return res.redirect("/docs");
};

// Login page - redirect to swagger if already authenticated
router.get("/", (req, res) => {
  const sessionToken = req.cookies?.docs_session;

  // If already authenticated, redirect to swagger
  if (sessionToken && authenticatedSessions.has(sessionToken)) {
    return res.redirect("/docs/swagger");
  }

  res.sendFile(path.join(__dirname, "../views/docs-login.html"));
});

// Login endpoint using user credentials
router.post("/login", express.json(), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Use existing auth service to verify credentials
    const result = await authService.login({ email, password });

    if (result && result.user) {
      const sessionToken = generateSessionToken();
      authenticatedSessions.set(sessionToken, {
        userId: result.user.id,
        email: result.user.email,
        loginAt: new Date(),
      });

      // Set session cookie - short-lived for security
      res.cookie("docs_session", sessionToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000, // 10 minutes
        sameSite: "lax", // Changed to lax for redirect to work
      });

      return res.json({ success: true });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
});

// Swagger UI (protected) - serve must come before setup
router.use("/swagger", docsAuthMiddleware, swaggerUi.serve);
router.get("/swagger", docsAuthMiddleware, swaggerUi.setup(swaggerDocument));

// Logout endpoint
router.post("/logout", (req, res) => {
  const sessionToken = req.cookies?.docs_session;

  if (sessionToken) {
    authenticatedSessions.delete(sessionToken);
    res.clearCookie("docs_session");
  }

  res.json({ success: true });
});

module.exports = router;
