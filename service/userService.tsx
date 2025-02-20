import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class UserSignUpService{

    // API calls for user creation
    createUser(user){
        return axiosInstance.post("/user", user);
    }
    createRoadMap(id){
        return axiosInstance.post(`/generate`, {id});
    }

    // API calls for user retrieval
    findRoadMap(id){
        return axiosInstance.get(`/user/${id}/roadmap`);
    }
    listOne(id){
        return axiosInstance.get(`/user/${id}`);
    }
    listAll(){
        return axiosInstance.get("/users");
    }

}