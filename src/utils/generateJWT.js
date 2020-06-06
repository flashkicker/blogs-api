import jwt from "jsonwebtoken"

const generateJWT = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7 days",
	})
}

export default generateJWT