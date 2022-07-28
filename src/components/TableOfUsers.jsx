import react from "react";
import { useEffect, useState, useRef } from "react";
import { Button, Table, Checkbox, TextInput } from "@mantine/core";
import api from "../api/api.js";
import "./style.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function TableOfUsers({
  setTasks,
  tasks,
  setStart,
  start,
  showMore,
  setAddSubtask,
  theme,
}) {
  const titleRef = useRef();
  const [updateTitle, setUpdateTitle] = useState(false);
  const [subtaskFlag, setSubtaskFlag] = useState(false);

  const handleEdit = /*async*/ (task) => {
    const updatedTask = task;
    try {
      //const response = await api.put(`/${updatedTask.id}`, updatedTask);
      setTasks(
        tasks.map((task) =>
          task.id == updatedTask.id ? { ...updatedTask } : task
        )
      );
    } catch (err) {
      //console.log(`Error: ${err.message}`);
      console.log("Executing catch in handleEdit...");
    }
  };

  const handleDelete = /*async*/ (id) => {
    if (tasks.find((el) => el.id == id)) {
      try {
        //await api.delete(`/${id}`);

        let tasksList = tasks;

        const ind = tasksList.findIndex((task) => task.id == id);
        for (let i = ind + 1; i < tasksList.length; i++) {
          if (tasksList[i] - tasksList[i - 1] > 2) {
            break;
          } else {
            tasksList[i].priority--;
          }
        }

        tasksList = tasksList.filter((task) => task.id != id);
        setTasks(tasksList);
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
    } else alert("Ne postoji task sa tim id-em!");
  };

  const handleDeleteSubtask = /*async*/ (task, subtask) => {
    try {
      //await api.delete(`/${id}`);
      let tasksUpdated = tasks.map((el) => {
        if (el.id == task.id) {
          el.subtasks = el.subtasks.filter(
            (subt) => subt.title != subtask.title
          );
        }
        return el;
      });
      setTasks(tasksUpdated);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempData = Array.from(tasks);
    const newPriority = tempData[e.destination.index].priority;
    const oldPriority = tempData[e.source.index].priority;
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    if (e.destination.index <= e.source.index) {
      tempData[e.destination.index].priority = newPriority;
      for (let i = e.destination.index + 1; i <= e.source.index; i++) {
        if (tempData[i] - tempData[i - 1] > 2) break;
        else {
          tempData[i].priority++;
        }
      }
    } else {
      tempData[e.source.index].priority = oldPriority;
      tempData[e.destination.index].priority = newPriority;
      for (let i = e.source.index + 1; i < e.destination.index; i++) {
        if (tempData[i] - tempData[i - 1] > 2) break;
        else {
          tempData[i].priority--;
        }
      }
    }
    setTasks(tempData);
  };

  function subrows(task) {
    if (task.subtasks) {
      return task.subtasks.map((subtask) => {
        return (
          <tr
            key={subtask.title}
            className={"text-xs" + (theme === "dark" ? " text-white" : "")}
          >
            <td></td>
            <td></td>
            <td>{subtask.title}</td>
            <td></td>
            <td></td>
            <td>
              <Checkbox
                size="sm"
                defaultChecked={subtask.completed ? true : false}
              />
            </td>
            <td>
              <Button
                size="xs"
                className="bg-red-400 hover:bg-red-300"
                onClick={() => {
                  handleDeleteSubtask(task, subtask);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      });
    } else return "";
  }

  const subtasksTable = (task) => {
    return task.subtasks ? (
      <table>
        <thead>
          <th>Title</th>
          <th>Completed</th>
        </thead>
        <tbody>{subrows(task)}</tbody>
      </table>
    ) : (
      <div>No subtasks</div>
    );
  };

  const getItemStyle = (isDragging, draggableStyle) =>
    isDragging
      ? {
          // some basic styles to make the items look a bit nicer
          userSelect: "none",

          // change background colour if= dragging
          display: "flex",
          pointerEvents: "auto",
          cursor: isDragging ? "all-scroll" : "pointer",
          // styles we need to apply on draggables
          ...draggableStyle,
        }
      : { ...draggableStyle };

  const getTdStyle = (isDragging, draggableStyle, flag) =>
    isDragging
      ? {
          width:
            flag == 1
              ? "5.5%"
              : flag == 2
              ? "2.3%"
              : flag == 3
              ? "32.5%"
              : flag == 4
              ? "22.5%"
              : flag == 5
              ? "22%"
              : flag == 6
              ? "7%"
              : "",
        }
      : {};

  const rows = tasks.map((task, index) => (
    <Draggable draggableId={task.id.toString()} key={task.id} index={index}>
      {(provided, snapshot) => (
        <>
          <tr
            {...provided.draggableProps}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            className={"text-xs" + (theme === "dark" ? " text-white" : "")}
          >
            <td
              style={getTdStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                1
              )}
            >
              {task.priority}
            </td>
            <td
              style={getTdStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                2
              )}
            >
              {task.id}
            </td>
            <td
              style={getTdStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                3
              )}
            >
              {task.title}
            </td>
            <td
              style={getTdStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                4
              )}
            >
              <div className="flex items-center">
                {subtaskFlag && subtaskFlag == task.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5  cursor-pointer mx-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => setSubtaskFlag(null)}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 cursor-pointer mx-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => setSubtaskFlag(task.id)}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </td>
            <td
              style={getTdStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                5
              )}
            >
              {updateTitle == task.id ? (
                <div className="flex items-center ">
                  <TextInput
                    required
                    placeholder="Enter new title"
                    ref={titleRef}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        task.title = titleRef.current.value;
                        handleEdit(task);
                        setUpdateTitle(null);
                      }
                    }}
                  />
                  <Button
                    className="bg-blue-500 mx-2"
                    onClick={() => {
                      task.title = titleRef.current.value;
                      handleEdit(task);
                      setUpdateTitle(null);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-400 mx-2"
                    onClick={() => setUpdateTitle(null)}
                  >
                    Discard
                  </Button>
                </div>
              ) : (
                <Button
                  className="bg-blue-500"
                  onClick={() => setUpdateTitle(task.id)}
                >
                  Update title
                </Button>
              )}
            </td>
            <td
              style={getTdStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                6
              )}
            >
              <Checkbox
                size="xl"
                color={theme === "dark" ? "gray" : "white"}
                defaultChecked={task.completed ? true : false}
                onClick={() => {
                  task.completed = !task.completed;
                  handleEdit(task);
                }}
              />
            </td>
            <td>
              <Button
                className="bg-red-400 mt-2 hover:bg-red-300"
                onClick={() => {
                  handleDelete(task.id);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
          {subtaskFlag == task.id ? subrows(task) : ""}
          {subtaskFlag == task.id ? (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Button
                  className="bg-green-500 m-4 hover:bg-green-300"
                  onClick={() => setAddSubtask(task.id)}
                >
                  Add subtask
                </Button>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ) : (
            ""
          )}
        </>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Table m={10}>
        <thead>
          <tr>
            <th className="">Priority</th>
            <th>Id</th>
            <th>Title</th>
            <th>
              <div className="w-64"></div>
            </th>
            <th>
              <div className="w-64"></div>
            </th>
            <th>Completed</th>
          </tr>
        </thead>
        <Droppable droppableId="droppable-1">
          {(provided, snapshot) => (
            <tbody ref={provided.innerRef} {...provided.droppableProps}>
              {rows}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
}

export default TableOfUsers;

/*
<div className="flex justify-center">
        {showMore ? (
          <Button
            className="bg-blue-500"
            onClick={() => {
              setStart(start + 20);
            }}
          >
            Show more
          </Button>
        ) : (
          ""
        )}
      </div>
*/
