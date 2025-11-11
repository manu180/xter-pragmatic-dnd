import { useRef, useEffect, useState } from "react";
import type { Document } from "../types/data";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DragHandle } from "./draggable/drag-handle";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import type { DocumentElement, DraggableState } from "../types/draggable";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
import { DragPreview } from "./draggable/drag-preview";

interface DocumentCardProps {
  groupId: string;
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, groupId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<DraggableState>({
    type: "idle",
  });

  useEffect(() => {
    if (!ref.current || !dragHandleRef.current) return;
    const data: DocumentElement = { type: "document", groupId, id: document.id };
    return draggable({
      element: dragHandleRef.current,
      getInitialData: () => data,
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
    });
  }, [groupId, document.id]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className={twMerge(
          "bg-gray-50 border border-gray-200 rounded-md p-2 transition-transform hover:shadow-md group",
          state.type === "is-dragging" && "opacity-40"
        )}
      >
        <div className="flex items-center gap-3">
          <DragHandle ref={dragHandleRef} />
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="text-xl text-blue-800 font-semibold">{document.name}</h3>
            <div className="space-y-2">
              {document.files.map((file) => (
                <div key={file.id} className="bg-gray-100 px-3 py-2 rounded text-sm text-gray-600">
                  <span className="font-mono">{file.filename}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {state.type === "preview" && createPortal(<DragPreview value={`${document.id}`} />, state.container)}
    </div>
  );
};

export default DocumentCard;
