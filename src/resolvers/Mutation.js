import bcrypt from "bcrypt"
import getUserId from "../utils/getUserId"
import generateJWT from "../utils/generateJWT"
import hashPassword from "../utils/hashPassword"

const Mutation = {
	async createUser(parent, { data }, { prisma }, info) {
		const password = await hashPassword(data.password)
		const user = await prisma.mutation.createUser({
			data: {
				...data,
				password,
			},
		})

		return {
			user,
			token: generateJWT(user.id),
		}
	},
	deleteUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		return prisma.mutation.deleteUser(
			{
				where: { id: userId },
			},
			info
		)
	},
	async updateUser(parent, { data }, { prisma, request }, info) {
		const userId = getUserId(request)

		if(typeof data.password === "string") {
			data.password = await hashPassword(data.password)
		}

		return prisma.mutation.updateUser(
			{
				where: { id: userId },
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

		return {
			user,
			token: generateJWT(user.id),
		}
	},
	createPost(parent, { data }, { prisma, request }, info) {
		const userId = getUserId(request)
		const { title, body, published } = data

		return prisma.mutation.createPost(
			{
				data: {
					title,
					body,
					published,
					author: { connect: { id: userId } },
				},
			},
			info
		)
	},
	async deletePost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)
		const postExists = await prisma.exists.Post({
			id: args.id,
			author: { id: userId },
		})

		if (!postExists) throw new Error("Unable to delete post")

		return prisma.mutation.deletePost(
			{
				where: { id: args.id },
			},
			info
		)
	},
	async updatePost(parent, { id, data }, { prisma, request }, info) {
		const userId = getUserId(request)
		const postExists = await prisma.exists.Post({
			id,
			author: { id: userId },
		})

		if (!postExists) throw new Error("Unable to update post")

		const isPublished = await prisma.exists.Post({ id, published: true })

		if (isPublished && data.published === false) {
			await prisma.mutation.deleteManyComments({
				where: { post: { id } },
			})
		}

		return prisma.mutation.updatePost(
			{
				data,
				where: { id },
			},
			info
		)
	},
	async createComment(parent, { data }, { prisma, request }, info) {
		const userId = getUserId(request)
		const { text, post } = data
		const postExists = await prisma.exists.Post({
			published: true,
			id: post,
		})

		if (!postExists) throw new Error("Unable to create comment")

		return prisma.mutation.createComment(
			{
				data: {
					text,
					author: { connect: { id: userId } },
					post: { connect: { id: post } },
				},
			},
			info
		)
	},
	async deleteComment(parent, { id }, { prisma, request }, info) {
		const userId = getUserId(request)
		const commentExists = await prisma.exists.Comment({
			id,
			author: { id: userId },
		})

		if (!commentExists) throw new Error("Unable to delete comment")

		return prisma.mutation.deleteComment(
			{
				where: { id },
			},
			info
		)
	},
	async updateComment(parent, { id, data }, { prisma, request }, info) {
		const userId = getUserId(request)
		const commentExists = await prisma.exists.Comment({
			id,
			author: { id: userId },
		})

		if (!commentExists) throw new Error("Unable to delete comment")

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
