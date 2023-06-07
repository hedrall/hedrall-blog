import Layout from "../components/Layout";
import BasicMeta from "../components/meta/BasicMeta";
import OpenGraphMeta from "../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../components/meta/TwitterCardMeta";
import { SocialList } from "../components/SocialList";

export default function Index() {
  return (
    <Layout>
      <BasicMeta url={"/"} />
      <OpenGraphMeta url={"/"} />
      <TwitterCardMeta url={"/"} />
      <div className="container">
        <div>
          <h1>
            Hedrallの技術ブログ<span className="fancy">.</span>
          </h1>
          <span className="handle">@_hedrall</span>
          <h2>フロントエンドを中心に雑食です。</h2>
          <SocialList />
        </div>
      </div>
      <style jsx>{`
        
      `}</style>
    </Layout>
  );
}
