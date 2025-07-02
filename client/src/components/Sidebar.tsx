
const Sidebar = () => {

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="p-4 hover:bg-slate-800 border-b border-slate-800 cursor-pointer"
          >
            <h3 className="font-medium">User {i + 1}</h3>
            <p className="text-sm text-slate-400">Last message preview...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;