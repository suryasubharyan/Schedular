import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import {OAuth2Client} from "google-auth-library";
import User from "../models/user.model.js";
import {
  ValidationError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../errors/AppError.js";

if(!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const serializeUser = (user) => ({
    id: user._id,
    email: user.email,
    name: user.name || "",
    headline: user.headline || "",
    profilePicture: user.customProfilePicture || "",
    authProvider: user.authProvider,
});

const validateEmailFormat = (email) => {
    if(!EMAIL_REGEX.test(email)){
        throw new ValidationError("Invalid email format");
    }
};

const validatePasswordStrength = (password) => {
    if(!password || password.length < 8){
        throw new ValidationError("Password must be at least 8 characters long");
    }
    if(!/[a-z]/.test(password)){
        throw new ValidationError("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
    throw new ValidationError("Password must contain at least one uppercase letter");
    }
    if(!/\d/.test(password)){
        throw new ValidationError("Password must contain at leat one number");
    }
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(password)){
        throw new ValidationError("Password must contain at least one special character");
    }
};

const issueAuthToken = (user) => 
     new SignJWT({userId: user._id.toString(), email: user.email})
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

export const registerUser = async ({email, password, name}) => {
    if (!email || !password){
        throw new ValidationError("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    validateEmailFormat(normalizedEmail);
    validatePasswordStrength(password);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new ConflictError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return User.create({
        email: normalizedEmail,
        password: hashedPassword,
        name: name?.trim() || normalizedEmail.split("@")[0],
        authProvider: "local",
        lastLogin: new Date(),
    });
};

export const loginUser = async ({email, password}) => {
    if(!email || !password) {
        throw new ValidationError("Email and password are required");
    }

    const  normalizedEmail = email.trim().toLowerCase();
    validateEmailFormat(normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail, authProvider: "local" });
    if(!user){
        throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new UnauthorizedError("Invalid email or password");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = await issueAuthToken(user);
    return { user, token };
};

export const loginWithGoogle = async (googleToken) => {
    if(!googleToken) {
        throw new ValidationError("Google taken is required");
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if(!payload?.email){
        throw new ValidationError("Google accoutn email is missing");
    }

    const normalizedEmail = payload.email.trim().toLowerCase(); 
    let user = await User.findOne({
        $or: [{googleId: payload.sub}, {email: normalizedEmail}],
    });

    if(user) {
        if(user.authProvider === "local" && !user.googleId){
            throw new ConflictError(
        "An account with this email already exists. Please login with your password."
            );
        }

        if(!user.googleId) user.googleId = payload.sub;
        if(user.authProvider !== "local") user.authProvider = "google";

        user.name = payload.name || user.name;
        user.lastLogin = new Date();
        await user.save();
    } else {
        user = await User.create({
            googleId: payload.sub,
            email: normalizedEmail,
            name: payload.name,
            authProvider: "google",
            lastLogin: new Date(),
        });
    }

    const token = await issueAuthToken(user);
    return {user, token};
};

export const verifyUserToken = async (token) => {
    if(!token) {
        throw new UnauthorizedError("Token is required");
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const user = await User.findById(verified.payload.userId);

    if(!user) {
        throw new NotFoundError("User not found");
    }
    return user;
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError("User not found");
    }
    return user;
}

export const updateUserProfile = async (userId, {name, email, headline, profilePicture}) => {
    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError("User not found");
    }

    const nextEmail = typeof email === "string" ? email.trim().toLowerCase() : user.email;
    if (nextEmail && nextEmail !== user.email) {
        const existingUser = await User.findOne({ email: nextEmail, _id: { $ne: userId } });
        if (existingUser){
            throw new ConflictError("Email is already in use");
        }
        user.email = nextEmail;
    }

    if(typeof name === "string") user.name = name.trim();
    if(typeof headline === "string") user.headline = headline.trim();
    if(typeof profilePicture === "string") user.customProfilePicture = profilePicture.trim();

    await user.save();
    return user;
}