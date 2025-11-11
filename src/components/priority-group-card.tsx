import { useRef, useEffect, useState } from "react";
import type { Group } from "../types/data";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  type ElementDropTargetEventBasePayload,
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { DropIndicator } from "./draggable/drop-indicator";
import DocumentCard from "./document-card";
import { twMerge } from "tailwind-merge";
import {
  attachInstruction,
  extractInstruction,
  type Instruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";
import { createPortal } from "react-dom";
import { isDocumentElement, isGroupElement, type DraggableState, type GroupElement } from "../types/draggable";
import { getOperationAvailability } from "../util/draggable-util";
import { DragHandle } from "./draggable/drag-handle";
import { DragPreview } from "./draggable/drag-preview";

interface PriorityGroupProps {
  groupIndex: number;
  groupCount: number;
  group: Group;
}

const PriorityGroupCard = ({ groupIndex, groupCount, group }: PriorityGroupProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<DraggableState>({
    type: "idle",
  });
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  //console.log(`Rendering PriorityGroupCard ${groupIndex} - ${state.type}`);
  useEffect(() => {
    if (!ref.current || !dragHandleRef.current) return;
    const element = ref.current;
    const dragHandle = dragHandleRef.current;
    const data: GroupElement = { type: "group", index: groupIndex, id: group.id };
    function onChange({ source, self }: ElementDropTargetEventBasePayload) {
      if (self.element === source.element) {
        return;
      }
      const instruction = extractInstruction(self.data);
      setInstruction(instruction);
    }
    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData() {
          //return getTaskData(task);
          return data;
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            render({ container }) {
              setState({ type: "preview", container });
              return () => setState({ type: "is-dragging" });
            },
          });
        },
        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState({ type: "idle" });
        },
      }),
      dropTargetForElements({
        element,
        getIsSticky: () => true,
        // canDrop({ source }) {
        //   return isPriorityDragData(source.data) && source.data.id === data.id;
        // },
        getData({ input, source }) {
          // handle group drop
          if (isGroupElement(source.data)) {
            return attachInstruction(data, {
              element,
              input,
              operations: getOperationAvailability(source.data.index, groupIndex, groupCount - 1),
            });
          }
          // handle document drop
          if (isDocumentElement(source.data)) {
            console.log(`Document ${source.data.id} dragged over group ${group.id}`);
            return attachInstruction(data, {
              element,
              input,
              operations: {
                "reorder-before": "available",
                "reorder-after": "available",
                combine: "available",
              },
            });
          }
          return attachInstruction(data, {
            element,
            input,
            operations: {
              "reorder-before": "not-available",
              "reorder-after": "not-available",
              combine: "not-available",
            },
          });
        },
        onDragEnter: onChange,
        onDrag: onChange,
        onDragLeave() {
          setInstruction(null);
        },
        onDrop() {
          setInstruction(null);
        },
      })
    );
  }, [group.id, groupIndex, groupCount]);

  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          className={twMerge(
            "flex flex-col bg-white rounded-lg p-2 shadow-sm gap-3",
            state.type === "is-dragging" && "opacity-40"
          )}
        >
          <div className="flex items-center gap-3">
            <DragHandle ref={dragHandleRef} />
            <h2 className="text-2xl text-blue-600 ">{group.id}</h2>
          </div>

          {group.documents.length > 0 && (
            <div className="grid gap-2">
              {group.documents.map((doc) => (
                <DocumentCard key={doc.id} groupId={group.id} document={doc} />
              ))}
            </div>
          )}
        </div>
        {/* <DropIndicator
          instruction={{ operation: "combine", blocked: false, axis: "vertical" }}
          lineGap="8px"
        /> */}
        {instruction && <DropIndicator instruction={instruction} lineGap="8px" />}
      </div>
      {state.type === "preview" && createPortal(<DragPreview value={`${group.id}`} />, state.container)}
    </>
  );
};

export default PriorityGroupCard;
