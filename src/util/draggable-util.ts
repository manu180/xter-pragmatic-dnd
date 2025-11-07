import type { Instruction } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/list-item";
import type { Availability } from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

function getReorderDestinationIndex({
  startIndex,
  instruction,
  indexOfTarget,
}: {
  startIndex: number;
  instruction: Instruction | null;
  indexOfTarget: number;
}): number {
  // invalid index's
  if (startIndex === -1 || indexOfTarget === -1) {
    return startIndex;
  }

  // if we are targeting the same index we don't need to do anything
  if (startIndex === indexOfTarget) {
    return startIndex;
  }

  if (instruction == null) {
    return indexOfTarget;
  }

  const isGoingAfter: boolean = instruction.operation === "reorder-after";

  const isMovingForward: boolean = startIndex < indexOfTarget;
  // moving forward
  if (isMovingForward) {
    return isGoingAfter ? indexOfTarget : indexOfTarget - 1;
  }
  // moving backwards
  return isGoingAfter ? indexOfTarget + 1 : indexOfTarget;
}

export function reorderWithInstruction<Value>({
  list,
  startIndex,
  instruction,
  indexOfTarget,
}: {
  list: Value[];
  instruction: Instruction | null;
  startIndex: number;
  indexOfTarget: number;
}): Value[] {
  return reorder({
    list,
    startIndex,
    finishIndex: getReorderDestinationIndex({
      instruction,
      startIndex,
      indexOfTarget,
    }),
  });
}

type Operations = {
  [TKey in Instruction["operation"]]?: Availability;
};

export function getOperationAvailability(
  dragIndex: number,
  currentDropIndex: number,
  lastDropIndex: number
): Operations {
  //console.log(`calling getOperationAvailability source:${dragIndex} drop:${currentDropIndex} lastIndex:${lastDropIndex}`);
  if (dragIndex === lastDropIndex && dragIndex === currentDropIndex) {
    return {
      "reorder-before": "available",
      "reorder-after": "not-available",
      combine: "not-available",
    };
  }
  if (dragIndex === 0 && dragIndex === currentDropIndex) {
    return {
      "reorder-before": "not-available",
      "reorder-after": "available",
      combine: "not-available",
    };
  }
  return {
    "reorder-before": "available",
    "reorder-after": "available",
    combine: "not-available",
  };
}
