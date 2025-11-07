import type { Group } from "./data";

type DraggableIdle = {
  type: "idle";
};
type DraggablePreview = {
  type: "preview";
  container: HTMLElement;
};
type DraggableIsDragging = {
  type: "is-dragging";
};
export type DraggableState = DraggableIdle | DraggablePreview | DraggableIsDragging;

export type GroupDraggable = Pick<Group, "id"> & {
  index: number;
  type: "group";
};

export function isGroupDraggable(value: unknown): value is GroupDraggable {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as GroupDraggable).id === "string" &&
    "type" in value &&
    typeof (value as GroupDraggable).type === "string" &&
    (value as GroupDraggable).type === "group"
  );
}
