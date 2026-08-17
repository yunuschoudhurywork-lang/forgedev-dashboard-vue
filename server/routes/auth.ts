import { Router } from "express";
import { WorkOS } from "@workos-inc/node";

const router = Router();

const workos = new WorkOS(process.env.WORKOS_API_KEY!,{
  clientId: process.env.WORKOS_CLIENT_ID!,
});

router.get("/login", (req, res) => {
  const authorizationUrl =
    workos.userManagement.getAuthorizationUrl({
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri: process.env.WORKOS_REDIRECT_URI!,
      provider: "authkit",
    });
    res.redirect(authorizationUrl);
});

/**
 * WorkOS redirects the user here after authentication.
 */
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (typeof code !== "string") {
    return res.status(400).json({
      message: "Authorization code is required",
    });
  }

  try {
    const authResponse =
      await workos.userManagement.authenticateWithCode({
        clientId: process.env.WORKOS_CLIENT_ID!,
        code,
        session: {
          sealSession: true,
          cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
        },
      });

    const { user, sealedSession } = authResponse;

    if (!user.email) {
      return res.status(400).json({
        message: "WorkOS did not return a user email",
      });
    }

    const loggedInUser = {
      id: user.id,
      email: user.email,
      name: user.firstName ?? "",
      role: "Client",
    };

    console.log("Authenticated user:", loggedInUser);

    res.cookie("wos-session", sealedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(process.env.FRONTEND_URL!);
  } catch (error) {
    console.error("WorkOS authentication failed:", error);

    return res.status(500).json({
      error: "Authentication failed",
    });
  }
});

/**
 * Return the currently authenticated user.
 */
router.get("/me", async (req, res) => {

  const sessionData = req.cookies["wos-session"];
  //using log here for temporary check(For diagnosing the 401)
   console.log("wos-session:", !!sessionData);

  if (!sessionData) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  try {
    const session = await workos.userManagement.loadSealedSession({
      sessionData,
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
    });

    const authResponse = await session.authenticate();

    if (!authResponse.authenticated) {
      return res.status(401).json({
        message: "Invalid or expired session",
        reason: authResponse.reason, 
      });
    }

    const { user, role } = authResponse;

    if (!user.email) {
      return res.status(401).json({
        message: "Authenticated user has no email",
      });
    }

    return res.json({
      id: user.id,
      email: user.email,
      name: user.firstName ?? "",
      role: role ?? null,
    });
  } catch (error) {
    console.error("Session validation failed:", error);

    return res.status(401).json({
      message: "Invalid session",
    });
  }
});

export default router;