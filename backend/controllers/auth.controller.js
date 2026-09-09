import {registerUser, loginUser, loginWithGoogle, verifyUserToken, getUserById, updateUserProfile, serializeUser} from "../services/auth.service.js";
import { getUserFriendlyError } from "../utils/error-message.util.js";

const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.ENV === "prod",
    sameSite: process.env.ENV === "prod" ? "None" : "Lax",
}

export const register = async (req, res) => {
  try {
    await registerUser(req.body);
    res.status(201).json({success: true, message: "Account created successfully"});
  } catch (error) {
     const statusCode = error.statusCode || 500;
     res.status(statusCode).json({
        success: false,
        error: statusCode === 500 
            ? getUserFriendlyError(error, "could'nt create account. Please try again again.") : error.message,
     })
  }
}


export const login = async (req, res) => {
  try {
    const {user, token} = await loginUser(req.body);
    res.cookie("token", token, AUTH_COOKIE_OPTIONS);
    res.json({ success: true, message: "Login successful", user: serializeUser(user) }); 
  }
  catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 500
         ? getUserFriendlyError(error, "could'nt login. Please try again again.") : error.message,
    });
  }
};

export const googleLogin  = async (req, res) => {
  try {
    const {user, token} = await loginWithGoogle(req.body.googleToken);
    res.cookie("token", token, AUTH_COOKIE_OPTIONS);
    res.json({ success: true, message: "Login successful", user: serializeUser(user) });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 500 ? "Google authentication failed. Please try again." : error.message,
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
     const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
     const user  = await verifyUserToken(token);
     res.json({ success: true, user: serializeUser(user) });
  } catch (error) {
     res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export const getCurrentUser = async (req, res) => {
   try {
      const user = await getUserById(req.user.userId);
      res.json({ success: true, user: serializeUser(user) });
   } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 
            ? getUserFriendlyError(error, "Couldn't load your account. Please try again.") : error.message,
      });
   }
};

export const updateProfile = async (req, res) => {
    try {
       const user = await updateUserProfile(req.user.userId, req.body);
       res.json({
         success: true,
         message: "Profile updated successfully",
         user: serializeUser(user),
       });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 
            ? getUserFriendlyError(error, "Couldn't update your profile. Please try again.") : error.message,   
    });
    }
}


export const logout  = (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logout successful" });
}
