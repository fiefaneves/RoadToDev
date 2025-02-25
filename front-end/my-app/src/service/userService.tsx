import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3005"
})

export class UserSignUpService{

    // API calls for user creation
    createUser(user: { name: string; email: string; password: string }){
        return axiosInstance.post("/user", user);
    }
    createRoadMap(id: string){
        return axiosInstance.post(`/generate`, {id});
    }
    login(credentials: { email: string; password: string }){
        return axiosInstance.post("/login", credentials);
    }

    // API calls for user retrieval
    findRoadMap(id: string){
        return axiosInstance.get(`/user/${id}/roadmap`);
    }
    getOne(id: string){
        return axiosInstance.get(`/user/${id}`);
    }
    getAll(){
        return axiosInstance.get("/users");
    }

}