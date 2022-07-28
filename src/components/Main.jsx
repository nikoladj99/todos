import react from "react";
import { useState, useEffect, useRef } from "react";
import TableOfUsers from "./TableOfUsers.jsx";
import { Button, TextInput, Select } from "@mantine/core";
import Form from "./Form.jsx";
import api from "../api/api.js";
import axios from "axios";
import "./style.css";
import { Switch } from "@mantine/core";

function Main({ theme, setTheme }) {
  const [tasks, setTasks] = useState([]);
  const [tasksFiltered, setTasksFiltered] = useState([]);
  const [addFormFlag, setAddFormFlag] = useState(false);
  const [addSubtask, setAddSubtask] = useState(false);
  const [delFormFlag, setDelFormFlag] = useState(false);
  const [start, setStart] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const delInputRef = useRef();
  let tasksForTable;
  let setTasksForTable;
  if (tasksFiltered.length === 0) {
    tasksForTable = tasks;
    setTasksForTable = setTasks;
  } else {
    tasksForTable = tasksFiltered;
    setTasksForTable = setTasksFiltered;
  }

  const fetchTasks = async () => {
    try {
      //const response = await api.get("?_start=" + start + "&_limit=20");
      const response = await api.get("");
      //const response = await axios.get("../../public/tasks.json");
      if (response.data.length < 20) setShowMore(false);
      if (tasks.length == 0) {
        let sortedTasks = sortTasks(response.data);
        setTasks(response.data);
      } else {
        const tmp = tasks.concat(response.data);
        let sortedTasks = sortTasks(tmp);
        setTasks(tmp);
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
    }
  };

  const sortTasks = (tasks) => {
    return tasks.sort((task1, task2) => {
      const priority1 = task1.priority ? task1.priority : 0;
      const priority2 = task2.priority ? task2.priority : 0;
      return priority1 - priority2;
    });
  };

  const handleDelete = /*async*/ (id) => {
    if (tasks.find((el) => el.id == id)) {
      try {
        //await api.delete(`/${id}`);
        const tasksList = tasks.filter((task) => task.id != id);
        setTasks(tasksList);
        delInputRef.current.value = "";
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
    } else alert("Ne postoji task sa tim id-em!");
  };

  let deleteForm = () => {
    return (
      <div className="p-2 w-44 my-2 rounded border-2 border-gray-500 flex flex-col items-center m-4">
        <div className="flex w-full justify-end ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            onClick={() => {
              setDelFormFlag(false);
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <TextInput ref={delInputRef}></TextInput>
        <Button
          className="bg-red-400 mt-2 hover:bg-red-300"
          onClick={() => {
            handleDelete(delInputRef.current.value);
          }}
        >
          Delete
        </Button>
      </div>
    );
  };

  useEffect(() => {
    fetchTasks();
  }, [start]);

  const newTaskForm = () => {
    return (
      <div className="overlay flex items-center justify-center">
        <Form
          setTasks={setTasks}
          tasks={tasks}
          sortTasks={sortTasks}
          setAddFormFlag={setAddFormFlag}
          setAddSubtask={setAddSubtask}
          addSubtask={addSubtask}
        ></Form>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-2">
      {addFormFlag || addSubtask ? newTaskForm() : ""}
      <div className="flex w-full">
        <div className="flex w-full justify-center items-center" style={{}}>
          <div className="flex justify-center">
            <Button
              className="bg-blue-500 mx-2"
              onClick={() => {
                setAddFormFlag(true);
              }}
            >
              Add task
            </Button>
          </div>
          <Select
            placeholder="Pick one"
            defaultValue="all"
            data={[
              { value: "all", label: "all" },
              { value: "completed", label: "completed" },
              { value: "uncompleted", label: "uncompleted" },
            ]}
            onChange={(e) => {
              if (e !== "all") {
                let tmp;
                if (e === "completed")
                  tmp = tasks.filter((el) => el.completed == true);
                else
                  tmp = tasks.filter((el) => {
                    console.log(
                      "title: " + el.title + " ,completed: " + el.completed
                    );
                    return el.completed == false;
                  });
                setTasksFiltered(tmp);
              } else {
                setTasksFiltered([]);
              }
            }}
          />
        </div>
        <div
          className={
            "flex items-center justify-around text-xs w-1/6" +
            (theme === "dark" ? " text-white" : "")
          }
        >
          <label>Light mode</label>
          <Switch
            color="gray"
            onChange={() => {
              theme === "dark" ? setTheme("light") : setTheme("dark");
            }}
          />
          <label>Dark mode</label>
        </div>{" "}
      </div>

      <TableOfUsers
        setAddSubtask={setAddSubtask}
        setTasks={setTasksForTable}
        tasks={tasksForTable}
        setStart={setStart}
        start={start}
        showMore={showMore}
        sortTasks={sortTasks}
        theme={theme}
      ></TableOfUsers>
    </div>
  );
}

export default Main;

/*
{delFormFlag ? (
          deleteForm()
        ) : (
          <div>
            <Button
              className="bg-red-500 mx-2 hover:bg-red-300"
              onClick={() => {
                setDelFormFlag(true);
              }}
            >
              Delete task
            </Button>
          </div>
        )}
*/
