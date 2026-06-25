import { redirect } from "next/navigation";

/** The community feed is the app's home. */
export default function Home() {
  redirect("/questions");
}
