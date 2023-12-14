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

const priorityLabels = {
  0: "low",
  1: "medium",
  2: "high",
};

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

interface SortStatus {
  [Username: string]: UserSort;
}

interface UserSort {
  [field: string]: boolean;
}

interface Ticket {
  id: string;
  content: string;
  priority: string;
  ticketNumber: string;
}

export default function PunchList() {
  const [columns, setColumns] = useState<{ name: string; items: Ticket[] }[]>();
  const [sortStatus, setSortStatus] = useState<SortStatus>({});

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

  const sortByField = (username: string, field: string) => {
    if (columns) {
      let updatedItems = Object.entries(columns)
        .find((column) => column[1].name === username)?.[1]
        .items.sort((item1, item2) => {
          let val1 = item1[field].toString(),
            val2 = item2[field].toString();

          if (
            sortStatus[username] === undefined ||
            sortStatus[username][field] === undefined
          ) {
            return val2.localeCompare(val1);
          }
          if (sortStatus[username][field]) {
            return val1.localeCompare(val2);
          }
          return val2.localeCompare(val1);
        });
      const updatedColumn = { name: username, items: updatedItems };
      let updatedColumns = columns;
      updatedColumns[username] = updatedColumn;
      setColumns({ ...updatedColumns });
    }
  };

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
                                <div
                                  className="w-10"
                                  onClick={() => {
                                    if (sortStatus[column.name] === undefined) {
                                      setSortStatus({
                                        ...sortStatus,
                                        [column.name]: {
                                          priority: true,
                                        },
                                      });
                                    } else {
                                      if (
                                        sortStatus[column.name]["priority"] ===
                                        undefined
                                      ) {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            priority: true,
                                          },
                                        });
                                      } else {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            priority:
                                              !sortStatus[column.name][
                                                "priority"
                                              ],
                                          },
                                        });
                                      }
                                    }
                                    sortByField(column.name, "priority");
                                  }}
                                >
                                  P
                                  {sortStatus[column.name] &&
                                    sortStatus[column.name]["priority"] !==
                                      undefined && (
                                      <>
                                        {sortStatus[column.name]["priority"] ===
                                          true && <span>&#8593;</span>}
                                        {sortStatus[column.name]["priority"] ===
                                          false && <span>&#8595;</span>}
                                      </>
                                    )}
                                </div>
                                <div
                                  className="w-20"
                                  onClick={() => {
                                    if (sortStatus[column.name] === undefined) {
                                      setSortStatus({
                                        ...sortStatus,
                                        [column.name]: {
                                          ticketNumber: true,
                                        },
                                      });
                                    } else {
                                      if (
                                        sortStatus[column.name][
                                          "ticketNumber"
                                        ] === undefined
                                      ) {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            ticketNumber: true,
                                          },
                                        });
                                      } else {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            ticketNumber:
                                              !sortStatus[column.name][
                                                "ticketNumber"
                                              ],
                                          },
                                        });
                                      }
                                    }
                                    sortByField(column.name, "ticketNumber");
                                  }}
                                >
                                  Key
                                  {sortStatus[column.name] &&
                                    sortStatus[column.name]["ticketNumber"] !==
                                      undefined && (
                                      <>
                                        {sortStatus[column.name][
                                          "ticketNumber"
                                        ] === true && <span>&#8593;</span>}
                                        {sortStatus[column.name][
                                          "ticketNumber"
                                        ] === false && <span>&#8595;</span>}
                                      </>
                                    )}
                                </div>
                                <div
                                  className="w-50"
                                  onClick={() => {
                                    if (sortStatus[column.name] === undefined) {
                                      setSortStatus({
                                        ...sortStatus,
                                        [column.name]: {
                                          content: true,
                                        },
                                      });
                                    } else {
                                      if (
                                        sortStatus[column.name]["content"] ===
                                        undefined
                                      ) {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            content: true,
                                          },
                                        });
                                      } else {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            content:
                                              !sortStatus[column.name][
                                                "content"
                                              ],
                                          },
                                        });
                                      }
                                    }
                                    sortByField(column.name, "content");
                                  }}
                                >
                                  Summary
                                  {sortStatus[column.name] &&
                                    sortStatus[column.name]["content"] !==
                                      undefined && (
                                      <>
                                        {sortStatus[column.name]["content"] ===
                                          true && <span>&#8593;</span>}
                                        {sortStatus[column.name]["content"] ===
                                          false && <span>&#8595;</span>}
                                      </>
                                    )}
                                </div>
                                <div
                                  className="w-20"
                                  onClick={() => {
                                    if (sortStatus[column.name] === undefined) {
                                      setSortStatus({
                                        ...sortStatus,
                                        [column.name]: {
                                          priority: true,
                                        },
                                      });
                                    } else {
                                      if (
                                        sortStatus[column.name]["priority"] ===
                                        undefined
                                      ) {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            priority: true,
                                          },
                                        });
                                      } else {
                                        setSortStatus({
                                          ...sortStatus,
                                          [column.name]: {
                                            priority:
                                              !sortStatus[column.name][
                                                "priority"
                                              ],
                                          },
                                        });
                                      }
                                    }
                                    sortByField(column.name, "priority");
                                  }}
                                >
                                  Status
                                  {sortStatus[column.name] &&
                                    sortStatus[column.name]["priority"] !==
                                      undefined && (
                                      <>
                                        {sortStatus[column.name]["priority"] ===
                                          true && <span>&#8593;</span>}
                                        {sortStatus[column.name]["priority"] ===
                                          false && <span>&#8595;</span>}
                                      </>
                                    )}
                                </div>
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
                                            {Number(item.priority) === 0 && (
                                              <img
                                                src={lowSvg}
                                                className="item-priority"
                                                alt="low"
                                              />
                                            )}
                                            {Number(item.priority) === 2 && (
                                              <img
                                                src={highSvg}
                                                className="item-priority"
                                                alt="high"
                                              />
                                            )}
                                            {Number(item.priority) === 1 && (
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
                                              <b>
                                                {priorityLabels[item.priority]}
                                              </b>
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
