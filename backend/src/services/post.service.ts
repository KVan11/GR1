import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

export const createPost = async ( userId: number, data: any)=> {
    const categoryIdsRaw = data.categoryIds ?? data.categories;
    if (!Array.isArray(categoryIdsRaw) || categoryIdsRaw.length === 0) {
        throw new Error("categoryIds phải là một mảng và không được rỗng");
    }

    const categoryIds = categoryIdsRaw.map((catId: number) => Number(catId));
    if (categoryIds.some((catId: number) => Number.isNaN(catId))) {
        throw new Error("categoryIds chứa giá trị không hợp lệ");
    }

    const existingCategories = await prisma.category.findMany({
        where: {
            id: {
                in: categoryIds
            }
        },
        select: {
            id: true
        }
    });

    const existingCategoryIds = new Set(existingCategories.map((c) => c.id));
    const missingCategoryIds = categoryIds.filter((id: number) => !existingCategoryIds.has(id));
    if (missingCategoryIds.length > 0) {
        throw new Error(`categoryIds không tồn tại: ${missingCategoryIds.join(', ')}`);
    }

    return await prisma.post.create({
        data: {
            user_id: userId,
            content: data.content,
            image: data.image || null,
            tag_list: data.tag_list,
            expired_time: new Date(data.expired_time),
            total_point: 0,
            categories: {
                create: categoryIds.map((catId: number) => ({ 
                    category_id: Number(catId)
                 }))
            }
        },
        include: {
            categories: true
        }
    })
}

export const getAllPosts = async () => {
    return await prisma.post.findMany({
        include: {
            user: {
                select: {
                    username: true,
                }
            },
            categories: {
                include: {
                    categories: true
                }
            }
        },
        orderBy: {
            created_date: 'desc'
        }
    });
};

export const deletePost = async (postId: number, userId: number) => {
    const post = await prisma.post.findUnique({ where: { 
        id: postId },
    });

    if(!post) {
        throw new Error("Bài viết không tồn tại");
    }

    if(post.user_id !== userId) {
        throw new Error("Bạn không có quyền xóa bài viết này");
    }

    return await prisma.$transaction(async (tx) => {
        await tx.catePost.deleteMany({ 
            where: { post_id: postId }
        });
        await tx.post.delete({ 
            where: { id: postId }
        });
    });
};