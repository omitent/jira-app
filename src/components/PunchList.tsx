import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

// import Api from "../../../utils/api";
import Api from "../api/api";
import "./PunchList.css";
import mediumSvg from "./icons/medium.svg";
import lowSvg from "./icons/low.svg";
import highSvg from "./icons/high.svg";
// import AppCover from "home/dashboad/AppCover";
import AppCover from "./AppCover";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

    const ticketId = columns[source.droppableId].items[source.index].id;
    const originColumnId = source.droppableId;
    const newColumnId = destination.droppableId;
    Api.updateTicketOwner(ticketId, originColumnId, newColumnId);
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

interface Ticket {
  id: string;
  content: string;
  priority: string;
  ticketNumber: string;
}

export default function PunchList() {
  const [columns, setColumns] = useState<{ name: string; items: Ticket[] }[]>();

  useEffect(() => {
    const tickets = Api.getJiraTickets();

    const ticketsByUser =
      tickets &&
      tickets.reduce((acc, ticket) => {
        if (!acc[ticket.owner.name]) {
          acc[ticket.owner.name] = {
            name: ticket.owner.name,
            items: [],
          };
        }
        acc[ticket.owner.name].items.push(ticket);
        return acc;
      }, []);

    setColumns(ticketsByUser);
  }, []);

  return (
    <AppCover>
      <div className="d-flex flex-wrap">
        {columns && Object.entries(columns).length ? (
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(
              ([columnId, column]: [
                string,
                { name: string; items: Ticket[] }
              ]) => {
                return (
                  <div
                    className="d-flex border align-items-center flex-column w-32 m-2"
                    key={columnId}
                  >
                    <div className="bg-light w-100 p-2">
                      <b>{column.name}</b>
                    </div>
                    <div className="h-600 overflow-y-auto overflow-x-hidden">
                      <Droppable droppableId={columnId} key={columnId}>
                        {(provided) => {
                          return (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="min-height-500 m-1 text-primary"
                            >
                              <div className="d-flex text-secondary p-2 border-bottom border-grey align-items-center">
                                <div className="w-10">P</div>
                                <div className="w-20">Key</div>
                                <div className="w-50">Summary</div>
                                <div className="w-20">Status</div>
                              </div>
                              {column.items.map((item, index) => {
                                return (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(provided) => {
                                      return (
                                        <div
                                          className="p-1 border-bottom d-flex align-items-center"
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <div className="w-10">
                                            {item.priority === "low" && (
                                              <img
                                                src={lowSvg}
                                                className="item-priority"
                                                alt="low"
                                              />
                                            )}
                                            {item.priority === "high" && (
                                              <img
                                                src={highSvg}
                                                className="item-priority"
                                                alt="high"
                                              />
                                            )}
                                            {item.priority === "medium" && (
                                              <img
                                                src={mediumSvg}
                                                className="item-priority"
                                                alt="medium"
                                              />
                                            )}
                                          </div>
                                          <div className="w-20">
                                            {item.ticketNumber}
                                          </div>
                                          <div className="w-50">
                                            {item.content}
                                          </div>
                                          <div className="w-20">
                                            <p className="badge">
                                              <b>{item.priority}</b>
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          );
                        }}
                      </Droppable>
                    </div>
                  </div>
                );
              }
            )}
          </DragDropContext>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </AppCover>
  );
}
