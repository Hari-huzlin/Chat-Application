import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        // Check for token in Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token is found, return an error
        if (!token) {
            console.log("No token found");
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging line

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Find the user by the decoded user ID
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("User found:", user); // Debugging line

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;

