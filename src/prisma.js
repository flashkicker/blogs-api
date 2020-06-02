import { Prisma } from "prisma-binding"

const prisma = new Prisma({
	typeDefs: "src/generated/prisma.graphql",
	endpoint: "http://192.168.99.100:4466",
})

export default prisma

// const createPostForUser = async (authorId, data) => {
// 	const userExists = await prisma.exists.User({ id: authorId })

// 	if (!userExists) throw new Error("User not found")

// 	return await prisma.mutation.createPost(
// 		{
// 			data: {
// 				...data,
// 				author: {
// 					connect: {
// 						id: authorId,
// 					},
// 				},
// 			},
// 		},
// 		`{ author { id name email posts { id title body published } } }`
// 	)
// }

// createPostForUser("ckar6zhaf001x0719zsubwe9m", {
// 	title: "Crap books to read",
// 	body: "The Art of War",
// 	published: true,
// })
// 	.then((user) => console.log(JSON.stringify(user, null, 2)))
// 	.catch((e) => console.error(e))

// const updatePostForUser = async (postId, data) => {
// 	const postExists = prisma.exists.Post({ id: postId })

// 	if (!postExists) throw new Error("User not found")

// 	return await prisma.mutation.updatePost(
// 		{
// 			data,
// 			where: {
// 				id: postId,
// 			},
// 		},
// 		`{ author { id name email posts { id title body published } } }`
// 	)
// }

// updatePostForUser("ckarbro58008b0719a3fednr", {
// 	title: "Okay books to read",
// 	published: true,
// })
// 	.then((data) => console.log(JSON.stringify(data, null, 2)))
// 	.catch((e) => console.log(e))
