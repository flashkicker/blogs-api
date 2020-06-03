import jwt from "jsonwebtoken"

const generateJWT = (userId) => {
	return jwt.sign({ userId }, "thisisasecret", {
		expiresIn: "7 days",
	})
}

export default generateJWT