import React, { useEffect, useRef } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { GridStack } from "gridstack";

import mediumSvg from "./icons/medium.svg";
import lowSvg from "./icons/low.svg";
import highSvg from "./icons/high.svg";

function OrderIcon(props) {
  const { order } = props;

  if (order === undefined) return null;

  if (order) {
    return <span className="m-1">&#8593;</span>;
  } else {
    return <span className="m-1">&#8595;</span>;
  }
}

export default function Column(props) {
  const { columnId, column, sortStatus, setSortStatus, sortByField } = props;
  const gridRef = useRef(null);

  useEffect(() => {
    var options = {
      draggable: {
        handle: ".ticket-header",
      },
    };
    if (gridRef.current) {
      GridStack.init(options);
    }
  }, []);

  return (
    <div ref={gridRef}>
      <div className="bg-light w-100 p-2 ticket-header">
        <b>{column.name}</b>
      </div>
      <div className="overflow-y-auto overflow-x-hidden">
        <Droppable droppableId={columnId}>
          {(provided) => {
            return (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <div className="d-flex text-secondary p-2 border-bottom border-grey align-items-center">
                  <div className="w-10 d-flex justify-content-center">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSortStatus({
                          ...sortStatus,
                          [column.name]: {
                            priority: !sortStatus[column.name]?.priority,
                          },
                        });
                        sortByField(column.name, "priority");
                      }}
                    >
                      P <OrderIcon order={sortStatus[column.name]?.priority} />
                    </div>
                  </div>
                  <div className="w-20 d-flex justify-content-center">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSortStatus({
                          ...sortStatus,
                          [column.name]: {
                            ticketNumber:
                              !sortStatus[column.name]?.ticketNumber,
                          },
                        });

                        sortByField(column.name, "ticketNumber");
                      }}
                    >
                      Key{" "}
                      <OrderIcon
                        order={sortStatus[column.name]?.ticketNumber}
                      />
                    </div>
                  </div>
                  <div className="w-50 d-flex justify-content-center">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSortStatus({
                          ...sortStatus,
                          [column.name]: {
                            content: !sortStatus[column.name]?.content,
                          },
                        });

                        sortByField(column.name, "content");
                      }}
                    >
                      Content{" "}
                      <OrderIcon order={sortStatus[column.name]?.content} />
                    </div>
                  </div>
                  <div className="w-20 d-flex justify-content-center">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSortStatus({
                          ...sortStatus,
                          [column.name]: {
                            status: !sortStatus[column.name]?.status,
                          },
                        });

                        sortByField(column.name, "status");
                      }}
                    >
                      Status{" "}
                      <OrderIcon order={sortStatus[column.name]?.status} />
                    </div>
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
                              <img
                                src={
                                  item.priority === 0
                                    ? highSvg
                                    : item.priority === 1
                                    ? mediumSvg
                                    : lowSvg
                                }
                                className="item-priority"
                                alt="priority"
                              />
                            </div>
                            <div className="w-20">{item.ticketNumber}</div>
                            <div className="w-50">{item.content}</div>
                            <div className="w-20 d-flex justify-content-center">
                              <b className="badge">{item.status}</b>
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
