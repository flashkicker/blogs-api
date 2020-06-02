import { v4 as uuidv4 } from "uuid"

const Mutation = {
	createUser(parent, args, { prisma }, info) {
		return prisma.mutation.createUser(
			{
				data: args.data,
			},
			info
		)
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
