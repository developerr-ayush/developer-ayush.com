import BlogDetail from "@/component/BlogDetail";

const page = async ({ params }: { params: { id: string } }) => {
    return <BlogDetail params={params} />
}

export default page