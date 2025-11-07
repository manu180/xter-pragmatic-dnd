import type { Group } from "./types/data";
import { getData } from "./data/data";
import List from "./components/list";

function App() {
  const items: Group[] = getData();
  return <List items={items} />;
}

export default App;
