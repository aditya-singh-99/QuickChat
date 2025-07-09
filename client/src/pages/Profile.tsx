import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuth from "../hooks/authHook";
import { getUserById } from "../services/userService";
import { UserIcon } from "@heroicons/react/24/solid";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(currentUser);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (id && id !== currentUser?.id) {
          const user = await getUserById(id);
          setProfileUser(user);
        }
      } catch (error: any) {
        alert(error.message);
      }
    };
    getUser();
  }, [id, currentUser]);

  if (!profileUser) return <p className="text-center mt-10">Profile not found</p>;

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center text-white">
        <UserIcon className="w-16 h-16 mx-auto mb-4 text-slate-400 bg-slate-700 p-3 rounded-full" />
        <h2 className="text-2xl font-bold mb-2">{profileUser.name}</h2>
        <p className="text-slate-300 mb-1">{profileUser.email}</p>
        <p className="text-slate-400 text-sm">Joined on {new Date(profileUser.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;