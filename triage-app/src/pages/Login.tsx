
import Loginform from '../components/LoginForm';

interface LoginProps {
  handleUserChange: (newUser: string) => void;
  user: string;
}

export default function Login({ handleUserChange, user }: LoginProps) {
  return <Loginform handleUserChange={handleUserChange} user={user} />;
}
