import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Login to our app !" },
  ];
}

import LoginForm from '../components/Login/login'

export default function Login() {
  return (
    <div className="">
      <LoginForm />
    </div>
  )
}
