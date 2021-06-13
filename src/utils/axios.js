import axios from "axios";
import { REACT_APP_BASE_URL } from "./endpoints";

const instance = axios.create({ baseURL: REACT_APP_BASE_URL });

export default instance;
