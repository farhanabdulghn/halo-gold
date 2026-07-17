import { Redirect } from "expo-router";

import { useAuth } from "@/context/auth-context";

export default function Index() {
  const { isAuthenticated } = useAuth();

  return <Redirect href={isAuthenticated ? "/dashboard" : "/login"} />;
}
