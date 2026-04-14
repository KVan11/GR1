import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

export const handleVote = async (postId: number, userId: number, point: number, tagName: string) => {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if(!post) {
        throw new Error("Bài viết không tồn tại");
    }

    const validTags = post.tag_list.split(',').map(t => t.trim());
    if (!validTags.includes(tagName)) {
        throw new Error(`Tag "${tagName}" không hợp lệ cho bài viết này`);
    }

    await prisma.vote.upsert({
        where: {
            post_id_user_id: {
                post_id: postId,
                user_id: userId
            }
        },
        update: {
            point: point,
            tag_name: tagName
        },
        create: {
            post_id: postId,
            user_id: userId,
            point: point,
            tag_name: tagName
        }
    });

    const aggregate = await prisma.vote.aggregate({
        where: { post_id: postId },
        _sum: { point: true }
    });

    const newTotalPoint = aggregate._sum.point || 0;
    await prisma.post.update({
        where: { id: postId },
        data: { total_point: newTotalPoint }
    });

    return newTotalPoint;
}