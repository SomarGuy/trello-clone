"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd";
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { PencilIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/store/ModalStore";


type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const setEditTodo = useBoardStore((state) => state.setEditTodo);
  const openModal = useModalStore((state) => state.openModal);

    const handleEditClick = () => {
      setEditTodo(todo);
      openModal(true, todo);
    };

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return 'No due date';
    }
    const localDate = parseISO(dateString);
    return format(localDate, 'PPP');
  };
  
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <div className="flex items-center">
          <button
          onClick={handleEditClick}
          className="text-gray-500 hover:text-gray-700 mr-2"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
          <button
            onClick={() => deleteTask(index, todo, id)}
            className="text-red-500 hover:text-red-600"
          >
            <XCircleIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
      <div className="p-2 flex items-start">
        <p className="text-gray-700 text-sm bg-gray-100 p-2 rounded-lg">{todo.description}</p>
      </div>
      <div className="p-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">Due:</span>
        <span className="text-sm bg-blue-100 text-blue-800 p-1 rounded-lg">
          {todo.dueDate ? formatDate(todo.dueDate) : "No due date"}
        </span>
      </div>
      
      {imageUrl && (
        <div className="relative h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
            priority
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
