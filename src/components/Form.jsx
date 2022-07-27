import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRef } from "react";
import api from "../api/api";

function Form({
  tasks,
  setTasks,
  setAddFormFlag,
  sortTasks,
  addSubtask,
  setAddSubtask,
}) {
  const form = useForm({
    initialValues: {
      userId: "",
      title: "",
      complited: false,
      priority: 0,
    },
  });

  const userIdRef = useRef();

  const handleSubmit = /*async*/ (values) => {
    if (!tasks.find((task) => task.title == values.title)) {
      const newTask = values;
      newTask.completed = false;
      newTask.id = tasks.length + 1;
      try {
        //const response = await api.post("", newTask);
        userIdRef.current.value = "";
        setTasks(sortTasks([...tasks, newTask]));
        setAddFormFlag(false);
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
    } else alert("Task sa datim title-om vec postoji!");
  };

  const handleSubmitSubtask = (values) => {
    const newSubtask = values;
    newSubtask.completed = false;
    let tasksUpdated = tasks.map((task) => {
      if (task.id == addSubtask) {
        let taskUpdated = task;
        if (!taskUpdated.subtasks) {
          taskUpdated.subtasks = [];
          taskUpdated.subtasks.push(newSubtask);
        } else {
          console.log("subtasks:");
          console.log(task.subtasks);
          if (
            task.subtasks.find(
              (subtask) => subtask.title.trim() == values.title.trim()
            )
          ) {
            alert("Subtask sa tim imenom vec postoji!");
          } else {
            taskUpdated.subtasks.push(newSubtask);
          }
        }
        return taskUpdated;
      } else return task;
    });
    setTasks(tasksUpdated);
    setAddSubtask(null);
  };

  return (
    <Box
      className="p-6 bg-blue-400 w-96 border-gray-500"
      sx={{ maxWidth: 300 }}
    >
      <div className="flex justify-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          onClick={() => {
            if (addSubtask) setAddSubtask(null);
            else setAddFormFlag(false);
          }}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <form
        onSubmit={form.onSubmit((values) => {
          if (!addSubtask) handleSubmit(values);
          else handleSubmitSubtask(values);
        })}
      >
        {!addSubtask ? (
          <TextInput
            required
            label="userId"
            placeholder="userId"
            ref={userIdRef}
            {...form.getInputProps("userId")}
          />
        ) : (
          ""
        )}

        <TextInput
          label="title"
          placeholder="title"
          {...form.getInputProps("title")}
        />
        {!addSubtask ? (
          <TextInput
            label="priority"
            placeholder="priority"
            {...form.getInputProps("priority")}
          />
        ) : (
          ""
        )}

        <Group className="flex justify-center" mt="md">
          <Button className="bg-blue-500" type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default Form;
