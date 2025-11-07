import { useRef, useEffect } from "react";
import type { Document } from "../types/data";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DragHandle } from "./draggable/drag-handle";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dragRef.current || !dragHandleRef.current) return;

    return draggable({
      element: dragRef.current,
      dragHandle: dragHandleRef.current,
      getInitialData: () => ({
        documentId: document.id,
      }),
    });
  }, [document.id]);

  return (
    <div
      ref={dragRef}
      className="bg-gray-50 border border-gray-200 rounded-md p-2 transition-transform hover:shadow-md group"
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
  );
};

export default DocumentCard;
