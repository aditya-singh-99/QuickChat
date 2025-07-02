import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="h-full w-full flex bg-slate-900 text-white">
      <div className="w-full max-w-[350px] border-r border-slate-700">
        <Sidebar />
      </div>
      <div className="flex-1">
        <ChatBox />
      </div>
    </div>
  );
};

export default Home;