import BlogDetail from "@/component/BlogDetail";

const page = async ({ params }: { params: { slug: string } }) => {
    return <BlogDetail params={params} />
}

export default page