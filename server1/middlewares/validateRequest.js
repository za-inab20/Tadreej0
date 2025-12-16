// Request validation middleware
export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Valid email is required" });
    }
    
    next();
};

export const validatePassword = (req, res, next) => {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    next();
};
