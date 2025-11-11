import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractInstruction, type Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";
import { isDocumentElement, isGroupElement, type DocumentElement, type GroupElement } from "../types/draggable";
import { reorderWithInstruction } from "../util/draggable-util";
import PriorityGroupCard from "./priority-group-card";
import type { Group } from "../types/data";
import { createGroup } from "../data/data";

export default function List({ items }: { items: Group[] }) {
  const [groups, setGroups] = useState<Group[]>(items);

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

        if (!isGroupElement(targetData)) {
          return;
        }
        const instruction = extractInstruction(target.data);
        if (isDocumentElement(sourceData)) {
          setGroups(
            insertGroupOrCombineDocuments(groups, sourceData, targetData, instruction).filter(
              (g) => g.documents.length > 0
            )
          );
          return;
        }

        if (isGroupElement(sourceData)) {
          setGroups(reorderGroups(groups, sourceData, targetData, instruction).filter((g) => g.documents.length > 0));
          return;
        }
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

function reorderGroups(
  groups: Group[],
  source: GroupElement,
  target: GroupElement,
  instruction: Instruction | null
): Group[] {
  const indexOfSource = groups.findIndex((p) => p.id === source.id);
  const indexOfTarget = groups.findIndex((p) => p.id === target.id);
  if (indexOfTarget < 0 || indexOfSource < 0) {
    return groups;
  }
  console.log("Instruction on drop:", instruction);
  return reorderWithInstruction({
    list: groups,
    startIndex: indexOfSource,
    indexOfTarget,
    instruction,
  });
}

function insertGroupOrCombineDocuments(
  groups: Group[],
  source: DocumentElement,
  target: GroupElement,
  instruction: Instruction | null
): Group[] {
  if (!instruction) {
    return groups;
  }
  switch (instruction.operation) {
    case "combine":
      return combineDocuments(groups, source, target);
    case "reorder-before":
      return insertGroup(groups, source, target, false);
    case "reorder-after":
      return insertGroup(groups, source, target, true);
  }
}

function insertGroup(groups: Group[], source: DocumentElement, target: GroupElement, isGoingAfter: boolean): Group[] {
  const sourceGroupIndex = groups.findIndex((g) => g.id === source.groupId);
  const sourceDocumentIndex = groups[sourceGroupIndex].documents.findIndex((d) => d.id === source.id);
  const targetGroupIndex = groups.findIndex((g) => g.id === target.id);

  const groupsBefore = isGoingAfter
    ? [...groups.slice(0, targetGroupIndex + 1)]
    : [...groups.slice(0, targetGroupIndex)];
  const groupsAfter = isGoingAfter ? [...groups.slice(targetGroupIndex + 1)] : [...groups.slice(targetGroupIndex)];

  const sourceGroup =
    sourceGroupIndex < groupsBefore.length
      ? groupsBefore[sourceGroupIndex]
      : groupsAfter[sourceGroupIndex - groupsBefore.length];

  const [document] = sourceGroup.documents.splice(sourceDocumentIndex, 1);
  const newGroup = createGroup(document ? [document] : []);
  const res = ([] as Group[]).concat(groupsBefore, newGroup, ...groupsAfter);
  console.log("Before:", groupsBefore, "New:", newGroup, "After:", groupsAfter);
  console.log("Inserting group after:", res);
  return res;
}

function combineDocuments(groups: Group[], source: DocumentElement, target: GroupElement): Group[] {
  const indexOfTarget = groups.findIndex((p) => p.id === target.id);
  const indexOfSourceGroup = groups.findIndex((g) => g.id === source.groupId);
  if (indexOfTarget < 0 || indexOfSourceGroup < 0 || indexOfSourceGroup === indexOfTarget) {
    return groups;
  }
  const sourceGroup = groups[indexOfSourceGroup];
  const sourceDocuments = [...sourceGroup.documents];
  const [document] = sourceDocuments.splice(
    sourceDocuments.findIndex((d) => d.id === source.id),
    1
  );
  const targetGroup = groups[indexOfTarget];
  const newGroups = [...groups];
  newGroups[indexOfSourceGroup] = {
    ...sourceGroup,
    documents: sourceDocuments,
  };
  newGroups[indexOfTarget] = {
    ...targetGroup,
    documents: [...targetGroup.documents, document],
  };
  return newGroups;
}
