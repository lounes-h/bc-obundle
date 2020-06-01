import PageManager from './page-manager';

// this is a custom JS module
export default class TaskTwo extends PageManager {
    onReady() {
        alert("Hello I'm a Task 2 module!");
    }
}
