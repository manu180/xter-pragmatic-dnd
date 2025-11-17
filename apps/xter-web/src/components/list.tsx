import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractInstruction, type Instruction } from "@xter-pragmatic-dnd/pragmatic-drag-and-drop-hitbox/list-item";
import { isDocumentElement, isGroupElement, type DocumentElement } from "../types/draggable";
import { reorderWithInstruction } from "../util/draggable-util";
import PriorityGroupCard from "./priority-group-card";
import type { Group } from "../types/data";
import { createGroup } from "../data/data";

export default function List({ items }: { items: Group[] }) {
  const [groups, setGroups] = useState<Group[]>(items);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const targetGroup = location.current.dropTargets[0]?.data;
        if (!isGroupElement(targetGroup)) {
          return;
        }
        const sourceElem = source.data;
        const instruction = extractInstruction(targetGroup);
        if (isDocumentElement(sourceElem)) {
          setGroups(
            insertGroupOrCombineDocuments(groups, sourceElem, targetGroup.id, instruction).filter(
              (g) => g.documents.length > 0
            )
          );
          return;
        }

        if (isGroupElement(sourceElem)) {
          setGroups(
            reorderGroups(groups, sourceElem.id, targetGroup.id, instruction).filter((g) => g.documents.length > 0)
          );
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
          <PriorityGroupCard key={p.id} isFirst={idx === 0} isLast={idx === groups.length - 1} group={p} />
        ))}
      </div>
    </div>
  );
}

function reorderGroups(
  groups: Group[],
  sourceGroupId: Group["id"],
  targetGroupId: Group["id"],
  instruction: Instruction | null
): Group[] {
  const indexOfSource = groups.findIndex((p) => p.id === sourceGroupId);
  const indexOfTarget = groups.findIndex((p) => p.id === targetGroupId);
  if (indexOfTarget < 0 || indexOfSource < 0) {
    return groups;
  }
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
  targetGroupId: Group["id"],
  instruction: Instruction | null
): Group[] {
  if (!instruction) {
    return groups;
  }
  switch (instruction.operation) {
    case "combine":
      return combineDocuments(groups, source, targetGroupId);
    case "reorder-before":
      return insertGroup(groups, source, targetGroupId, false);
    case "reorder-after":
      return insertGroup(groups, source, targetGroupId, true);
  }
}

function insertGroup(
  groups: Group[],
  source: DocumentElement,
  targetGroupId: Group["id"],
  isGoingAfter: boolean
): Group[] {
  const sourceGroupIndex = groups.findIndex((g) => g.id === source.groupId);
  const sourceDocumentIndex = groups[sourceGroupIndex].documents.findIndex((d) => d.id === source.id);
  const targetGroupIndex = groups.findIndex((g) => g.id === targetGroupId);

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
  return ([] as Group[]).concat(groupsBefore, newGroup, ...groupsAfter);
}

function combineDocuments(groups: Group[], source: DocumentElement, targetGroupId: Group["id"]): Group[] {
  const indexOfTarget = groups.findIndex((p) => p.id === targetGroupId);
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
