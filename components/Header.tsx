import { mainNav } from "@/lib/nav";
import { HeaderBar } from "./HeaderBar";

// Server half: the menu is built here from data/ (published items only, spec §8) and handed
// to the interactive client half as a prop — the content modules never ship to the browser.
export function Header() {
  return <HeaderBar nav={mainNav()} />;
}
