import {Service} from "typedi";

@Service()
export class UserService {
    getUsers() {
        return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
    }
}
