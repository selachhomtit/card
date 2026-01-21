import { PostResponse } from "@/lib/types/posts";
import { use } from "react";
import Link from "next/link";
import Cards from "./Cards";

export function CardClientList(
    { fetchPost }: { fetchPost: Promise<PostResponse[]> }) {
    // use hook 
    const posts = use(fetchPost)
    console.log(posts)
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                posts.map((post, index) => (
                    <Link
                        key={index}
                        href={`dashboard/blog/${post.id}`}>
                        <Cards
                            key={post.id}
                            userId={post.userId}
                            id={post.id}
                            title={post.title}
                            body={post.body}>

                        </Cards>
                    </Link>
                ))
            }


        </div>
    );
}

