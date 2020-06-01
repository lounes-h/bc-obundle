import PageManager from './page-manager';

// this is a custom JS module
export default class TaskOne extends PageManager {
    onReady() {
        alert("Hello I'm a Task 1 module!");
    }
}
