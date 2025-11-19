import axios from "axios";

const API = axios.create({
  baseURL:"https://85d741b476ad.ngrok-free.app"
});

export default API;