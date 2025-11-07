//import type { Group } from "./data";

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

type ElementId = {
  id: string;
};

export type GroupElement = ElementId & {
  index: number;
  type: "group";
};

export type DocumentElement = ElementId & {
  groupId: string;
  type: "document";
};

function isElementId(value: unknown): value is ElementId {
  return typeof value === "object" && value !== null && "id" in value && typeof (value as ElementId).id === "string";
}

export function isGroupElement(value: unknown): value is GroupElement {
  return (
    isElementId(value) &&
    "type" in value &&
    typeof (value as GroupElement).type === "string" &&
    (value as GroupElement).type === "group" &&
    "index" in value &&
    typeof (value as GroupElement).index === "number"
  );
}

export function isDocumentElement(value: unknown): value is DocumentElement {
  return (
    isElementId(value) &&
    "type" in value &&
    typeof (value as DocumentElement).type === "string" &&
    (value as DocumentElement).type === "document" &&
    "groupId" in value &&
    typeof (value as DocumentElement).groupId === "string"
  );
}
