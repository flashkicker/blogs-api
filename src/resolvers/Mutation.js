import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const Mutation = {
	async createUser(parent, { data }, { prisma }, info) {
		if (data.password.length < 8) {
			throw new Error("Password must be 8 characters or longer")
		}

		const password = await bcrypt.hash(data.password, 10)
		const user = await prisma.mutation.createUser({
			data: {
				...data,
				password,
			},
		})

		return { user, token: jwt.sign({ userId: user.id }, "thisisasecret") }
	},
	deleteUser(parent, args, { prisma }, info) {
		return prisma.mutation.deleteUser(
			{
				where: { id: args.id },
			},
			info
		)
	},
	updateUser(parent, { data, id }, { prisma }, info) {
		return prisma.mutation.updateUser(
			{
				where: { id },
				data,
			},
			info
		)
	},
	async login(parent, { data }, { prisma }, info) {
		const { email, password } = data
		
		const user = await prisma.query.user({ where: { email } })

		if (!user) throw new Error("Unable to login")

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) throw new Error("Unable to login")

		return { user, token: jwt.sign({ userId: user.id }, "thisisasecret") }
	},
	createPost(parent, { data }, { prisma }, info) {
		const { title, body, published, author } = data
		return prisma.mutation.createPost(
			{
				data: {
					title,
					body,
					published,
					author: { connect: { id: author } },
				},
			},
			info
		)
	},
	deletePost(parent, args, { prisma }, info) {
		return prisma.mutation.deletePost(
			{
				where: { id: args.id },
			},
			info
		)
	},
	updatePost(parent, { id, data }, { prisma }, info) {
		return prisma.mutation.updatePost(
			{
				data,
				where: { id },
			},
			info
		)
	},
	createComment(parent, { data }, { prisma }, info) {
		const { text, author, post } = data
		return prisma.mutation.createComment(
			{
				data: {
					text,
					author: { connect: { id: author } },
					post: { connect: { id: post } },
				},
			},
			info
		)
	},
	deleteComment(parent, { id }, { prisma }, info) {
		return prisma.mutation.deleteComment(
			{
				where: { id },
			},
			info
		)
	},
	updateComment(parent, { id, data }, { prisma }, info) {
		return prisma.mutation.updateComment(
			{
				data,
				where: { id },
			},
			info
		)
	},
}

export { Mutation as default }
