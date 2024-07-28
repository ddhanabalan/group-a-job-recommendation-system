import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export const navigate = (path) => {
    history.push(path);
};

export default history;