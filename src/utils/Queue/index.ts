import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";

class Queue {
  // Index, VideoMessageComponent
  items: Map<number, IVideoMessageComponent>;
  headIndex: number;
  tailIndex: number;
  isPlaying: boolean;
  constructor() {
    this.items = new Map<number, IVideoMessageComponent>();
    this.headIndex = 0;
    this.tailIndex = 0;
    this.isPlaying = true;
  }

  //adds a new element
  enqueue(element: IVideoMessageComponent) {
    this.items.set(this.tailIndex, element);
    this.tailIndex++;
    return element;
  }

  //removes an element from head of the queue
  dequeue() {
    const removedElement = this.items.get(this.headIndex);
    this.items.delete(this.headIndex);
    this.headIndex++;
    return removedElement;
  }

  //shows the head element of the  queue
  peek() {
    const peekElement = this.items.get(this.headIndex);
    return peekElement;
  }

  //shows the number of items in queue
  size() {
    return this.tailIndex - this.headIndex;
  }

  //checks if queue is empty or not
  isEmpty() {
    return this.tailIndex - this.headIndex == 0;
  }

  //pause the player
  pause() {
    this.isPlaying = false;
  }

  //resume the player
  resume() {
    this.isPlaying = true;
  }

  //iterates the queue
  *iterator() {
    let i = this.headIndex;
    while (i < this.tailIndex) {
      yield this.items.get(i++);
    }
  }

  //empty the queue
  clear() {
    this.items.clear();
    this.headIndex = 0;
    this.tailIndex = 0;
  }
}

export default Queue;
