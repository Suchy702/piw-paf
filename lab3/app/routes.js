import { index, route } from "@react-router/dev/routes"; 

export default [
  index("routes/home.jsx"),
  route("new", "routes/new.jsx"),
  route("edit/:id", "routes/edit.jsx")
];