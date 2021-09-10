import axios from "axios";

class EditorService {
    RunCode = (model) => {
        return axios.post('/api/ide/main', model);
    }
}

//singleton obejct
const service = new EditorService();
export default service;