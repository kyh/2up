// export const runtime = "edge";

const Page = async ({ params }: { params: { slug: string } }) => {
  return <>Team {params.slug}</>;
};

export default Page;
