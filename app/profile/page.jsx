"use client"

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyProfile = () => {
    const [posts, setPosts] = useState([])
    const { data: session } = useSession()
    const router = useRouter()
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await response.json()
            setPosts(data)
        }
        if (session?.user.id) {
            fetchPosts()
        }
    }, [session?.user.id])
    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`)
    }
    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

        if (hasConfirmed) {

            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: "DELETE"
                })

                const filteredPosts = posts.filter((p) => p._id.toString() !== post._id.toString())

                setPosts(filteredPosts)
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <Profile
            name={session?.user.name}
            desc="Welcome to your personalized profile page!"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default MyProfile