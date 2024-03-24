import { Share } from "@/component/Share";
import Image from "next/image"
import { redirect } from "next/navigation";
import { FaFacebook, FaFacebookF, FaShare, FaTwitter, FaWhatsapp } from "react-icons/fa"
import { FaThreads, FaXTwitter } from "react-icons/fa6";
interface Article {
    id: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    status: string,
    content: string,
    banner: string
    description?: string
    author: {
        name: string,
    }
}
async function getData(id: string) {
    const res = await fetch(`https://auth-sigma-two.vercel.app/api/blog/${id}`, { cache: "no-store" })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return res.json()
}
const page = async ({ params }: { params: { id: string } }) => {
    try {

        const data = await getData(params.id)
        return (
            <div className="blog-page">
                <div className="blog-image">
                    <Image src={data.banner} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="blog-details" width="1920" height="720" />
                </div>
                <div className="blog-content">
                    <div className="blog-head">
                        <h3 className="title">{data.title}</h3>
                        <div className="blog-data ">
                            <div className="blog-meta">
                                <p className="meta meta-date">{new Date(data.updatedAt).toLocaleDateString()}</p>
                                <p className="meta meta-author">{data.author.name}</p>
                            </div>
                            <Share title={data.title} />
                        </div>
                    </div>
                    <div className="blog-body">
                        <form dangerouslySetInnerHTML={{ __html: data.content }}></form>
                    </div>
                </div>

            </div>
        )
    } catch {
        redirect('/404')
    }

}

export default page