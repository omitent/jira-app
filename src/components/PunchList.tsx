import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import ReactGridLayout from "react-grid-layout";

// import Api from "../../../utils/api";
import Api from "../api/api";
import "./PunchList.css";

// import AppCover from "home/dashboad/AppCover";
import AppCover from "./AppCover";
import Column from "./Column";

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
  [Username: string]: { [field: string]: boolean };
}

interface Ticket {
  id: string;
  content: string;
  priority: number;
  ticketNumber: string;
  status: string;
}

export default function PunchList() {
  const [columns, setColumns] = useState<{ name: string; items: Ticket[] }[]>(
    []
  );
  const [sortStatus, setSortStatus] = useState<SortStatus>({});

  useEffect(() => {
    const tickets = Api.getJiraTickets();

    setColumns(tickets);
  }, []);

  const sortByField = (columnName: string, field: string) => {
    if (!columns) return;

    let columnIndex = -1;

    const columnEntries = Object.entries(columns);

    columnEntries.forEach((column, index) => {
      if (column[1].name === columnName) columnIndex = index;
    });
    if (columnIndex === -1) return;

    const sortedItems = [...columns[columnIndex].items].sort((item1, item2) => {
      const val1 = item1[field].toString();
      const val2 = item2[field].toString();

      const isAscending = sortStatus[columnName]?.[field] ?? false;
      return isAscending ? val1.localeCompare(val2) : val2.localeCompare(val1);
    });

    setColumns(
      columnEntries.map((column, index) => {
        console.log(column);
        if (index === columnIndex) {
          return {
            ...column[1],
            items: sortedItems,
          };
        }
        return column[1];
      })
    );
  };

  return (
    <AppCover>
      <div className="d-flex flex-wrap">
        {Object.entries(columns).length ? (
          <DragDropContext
            onDragEnd={(result) => {
              onDragEnd(result, columns, setColumns);
            }}
          >
            <ReactGridLayout
              className="layout"
              cols={12}
              rowHeight={50}
              draggableHandle=".ticket-header"
              width={window.innerWidth - 100}
            >
              {Object.entries(columns).map(
                (
                  [columnId, column]: [
                    string,
                    { name: string; items: Ticket[] }
                  ],
                  index
                ) => {
                  return (
                    <div
                      className="d-flex border align-items-center flex-column w-32 m-2"
                      key={columnId}
                      data-grid={{
                        x: (index * 4) % 12,
                        y: 0,
                        w: 4,
                        h: 9,
                      }}
                    >
                      <Column
                        key={columnId}
                        columnId={columnId}
                        column={column}
                        sortStatus={sortStatus}
                        setSortStatus={(status) => setSortStatus(status)}
                        sortByField={(columnName, field) =>
                          sortByField(columnName, field)
                        }
                      />
                    </div>
                  );
                }
              )}
            </ReactGridLayout>
          </DragDropContext>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </AppCover>
  );
}
