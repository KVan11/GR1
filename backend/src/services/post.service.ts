import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

const handleCategories = async (categoryIds: string[]) => {
    return await Promise.all(
        categoryIds.map(async (name: string) => {
            const category = await prisma.category.upsert({
                where: { category_name: name },
                update: {},
                create: { category_name: name },
            });
            return { category_id: category.id };
        })
    );
};

export const createPost = async ( userId: number, data: any)=> {
    const categoryNames = data.categories;
    if (!Array.isArray(categoryNames) || categoryNames.length === 0) {
        throw new Error("categoryIds phải là một mảng và không được rỗng");
    }

    const categoryLinks = await handleCategories(categoryNames);

    return await prisma.post.create({
        data: {
            user_id: userId,
            content: data.content,
            image: data.image || null,
            tag_list: data.tag_list,
            expired_time: new Date(data.expired_time),
            total_point: 0,
            categories: {
                create: categoryLinks
            }
        },
        include: {
            categories: { include: { categories: true } }
        }
    });
}

export const updatePost = async (postId: number, userId: number, data: any) => {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if(!post) {
        throw new Error("Bài viết không tồn tại");
    }

    if(post.user_id != userId) {
        throw new Error("Bạn không có quyền sửa bài viết");
    }

    const updateData: any = {
        content: data.content,
        image: data.image || null,
        tag_list: data.tag_list,
        expired_time: data.expired_time ? new Date(data.expired_time) : undefined,
    };
    
    if (data.categories) {
        if (!Array.isArray(data.categories) || data.categories.length === 0) {
            throw new Error("categories phải là một mảng và không được rỗng");
        }
        const categoryLinks = await handleCategories(data.categories);
        updateData.categories = {
            deleteMany: {},
            create: categoryLinks
        };
    }
    
    return await prisma.post.update({
        where: { id: postId },
        data: updateData,
        include: {
            categories: {
                include: {
                    categories: true
                }
            }
        }
    });
};

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