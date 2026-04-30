import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import Profile from "../components/profile";

function ProfilePage() {
  const { userId } = useParams();
  const { user } = useProfile(Number(userId));  // useParams gives a string, so cast it

  if (!user) return <p>Loading...</p>;

  return <Profile user={user} />;
}