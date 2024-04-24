import HomeMd from "@/markdown/home.mdx";

export default function Home() {
  return (
    <main className="w-9/10 max-w-[720px] mx-auto my-8">
      <div className="prose max-w-none px-6">
        <HomeMd></HomeMd>
      </div>
    </main>
  );
}
