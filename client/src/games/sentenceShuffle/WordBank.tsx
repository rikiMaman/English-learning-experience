import { motion, AnimatePresence } from "framer-motion";
import { DraggableItem } from "@/hooks/useDragAndDrop";

interface WordBankProps {
  availableItems: DraggableItem[];
  draggedItem: DraggableItem | null;
  handleItemSelect: (item: DraggableItem) => void;
  handleDragStart: (
    e: React.DragEvent<HTMLElement>,
    item: DraggableItem
  ) => void;
  handleDragEnd: () => void;
  paused: boolean|undefined;
}

export default function WordBank({
  availableItems,
  draggedItem,
  handleItemSelect,
  handleDragStart,
  handleDragEnd,
  paused,
}: WordBankProps) {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-3">
      <AnimatePresence>
        {availableItems.map((item) => {
          const isDragged = draggedItem?.id === item.id;
          return (
            <motion.button
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: isDragged ? 1.05 : 1,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className={`
    px-4 py-2 rounded-xl border-2 text-base font-medium 
    bg-white text-gray-900 
    shadow-sm transition duration-150 ease-in-out 
    select-none
    ${
      isDragged
        ? "opacity-80 shadow-md border-gray-400"
        : "border-gray-300 hover:bg-gray-100"
    }
    ${paused ? "cursor-not-allowed opacity-50" : "cursor-grab"}
  `}
              draggable={!paused}
              disabled={paused}
              onClick={() => handleItemSelect(item)}
              onDragStart={(e) => handleDragStart(e as any, item)}
              onDragEnd={handleDragEnd}
            >
              {item.value}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
