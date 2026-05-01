import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import Profile from "../components/profile";
import { Container } from "@chakra-ui/react";

export function ProfilePage() {
  const { userId } = useParams();
  const { user } = useProfile(Number(userId));

  if (!user) return <p>Loading...</p>;

  return (
    <Container maxW="600px" mt={8}>
      <Profile user={user} />
    </Container>
  );
}