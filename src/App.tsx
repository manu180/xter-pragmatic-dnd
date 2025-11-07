import { useEffect, useState } from "react";
import type { Group } from "./types/data";
import PriorityGroupCard from "./components/priority-group-card";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractInstruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";
import { reorderWithInstruction } from "./util/draggable-util";
import { isGroupDraggable } from "./types/draggable";
import { getData } from "./data/data";

function App() {
  const [groups, setGroups] = useState<Group[]>(getData());

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        console.log("Dropped", { source, location });

        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;

        if (!isGroupDraggable(sourceData) || !isGroupDraggable(targetData)) {
          return;
        }
        const indexOfSource = groups.findIndex((p) => p.id === sourceData.id);
        const indexOfTarget = groups.findIndex((p) => p.id === targetData.id);
        if (indexOfTarget < 0 || indexOfSource < 0) {
          return;
        }

        const instruction = extractInstruction(target.data);
        console.log("Instruction on drop:", instruction);
        setGroups(
          reorderWithInstruction({
            list: groups,
            startIndex: indexOfSource,
            indexOfTarget,
            instruction,
          })
        );
      },
    });
  }, [groups]);

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl text-gray-800 text-center mb-8 font-bold">Agent Context Model</h1>
      <div className="flex flex-col gap-2">
        {groups.map((p, idx) => (
          <PriorityGroupCard key={p.id} groupIndex={idx} groupCount={groups.length} group={p} />
        ))}
      </div>
    </div>
  );
}

export default App;
