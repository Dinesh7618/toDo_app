import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import "./task.css";
import TaskContext from "../../context/TaskContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import TokenContext from '../../context/TokenContext';
import { Checkbox, TextField, Typography } from "@mui/material";
import axios from "axios";

function Task({ task, id }) {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [isDone, setIsDone] = useState(task.completed);

  const handleRemove = async () => {
    try {
      const res = await axios.post("/api/task/removeTask", {
        task
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
    } catch (error) {
      console.log(error);
    }

    dispatch({
      type: "REMOVE_TASK",
      id,
    });
  };

  const handleMarkDone = async () => {
    try {
      const res = await axios.post("/api/task/editTask", {
        task: {
          ...task,
          completed: !isDone,
        }
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
    } catch (error) {
      console.log(error);
    }

    dispatch({
      type: "MARK_DONE",
      id,
      completed: !isDone,
    });

    setIsDone(!isDone);
  };

  useEffect(() => {
    if (isEditing) {
      dispatch({
        type: "EDIT_TASK",
        id,
        title: editedTitle,
        description: editedDescription,
      });
    }
  }, [editedTitle, editedDescription, isEditing, id, dispatch]);

  const editTask = async () => {
    try {
      const res = await axios.post("/api/task/editTask", {
        task: {
          ...task,
          title: editedTitle,
          description: editedDescription,
        }
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };

  return (
    <div className="bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3 overflow-hidden">
      <div className="mark-done">
        <Checkbox onChange={handleMarkDone} checked={isDone} />
      </div>
      <div className="task-info text-slate-900 text-sm w-10/12">
        {isEditing ? (
          <>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              label="Description"
              variant="outlined"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </>
        ) : (
          <>
            <Typography variant="h6" component="div">
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          </>
        )}
        <div className="italic opacity-60">
          {task?.createdAt ? (
            <p>Created: {moment(task.createdAt).fromNow()}</p>
          ) : (
            <p>just now</p>
          )}
        </div>
      </div>
      <div className="task-actions text-sm text-white">
        {!isEditing && (
          <EditIcon
            style={{ fontSize: 30, cursor: "pointer" }}
            onClick={() => setIsEditing(true)}
          />
        )}
        {isEditing && (
          <Icon
            path={mdiCheck}
            size={1}
            onClick={editTask}
            style={{ cursor: "pointer" }}
          />
        )}
        <DeleteIcon
          style={{ fontSize: 30, cursor: "pointer" }}
          onClick={handleRemove}
          className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1"
        />
      </div>
    </div>
  );
}

export default Task;
