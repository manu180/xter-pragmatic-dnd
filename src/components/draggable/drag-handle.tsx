import type { ComponentPropsWithRef } from "react";
import { GrDrag } from "react-icons/gr";

export function DragHandle({ ref }: ComponentPropsWithRef<"div">) {
  return (
    <div
      ref={ref}
      className="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
    >
      <GrDrag size={20} />
    </div>
  );
}
