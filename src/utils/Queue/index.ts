import {
  IVideoComponent,
  IQueueComponent,
  isPlaylist,
  isVideo
} from "../../interfaces/IQueueComponent";

class Queue {
  // Index, (Video | Playlist)
   items: Map<number, IVideoComponent | Queue>;
   headIndex: number;
   tailIndex: number;
   _isPlaying: boolean;
   type: "PLAYLIST" | "VIDEO";
  constructor(type: "PLAYLIST" | "VIDEO" = "VIDEO") {
    this.items = new Map<number, IVideoComponent | Queue>();
    this.headIndex = 0;
    this.tailIndex = 0;
    this._isPlaying = true;
    this.type = type;
  }

  //adds a new element
  enqueue(element: IQueueComponent) {
    switch (element.type) {
      case "VIDEO":
        this.items.set(this.tailIndex, element.video);
        this.tailIndex++;
        return;

      case "PLAYLIST":
        this.items.set(this.tailIndex, new Queue("PLAYLIST"));
        const playlist = this.items.get(this.tailIndex);
        if (isPlaylist(playlist)) {
          element.videos.map((video) =>
            playlist.items.set(playlist.tailIndex++, video)
          );
        }
        this.tailIndex++;
        return;
    }
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
    // The pause functionality of the internal queue i.e. the playlist is insignificant.
    // Different resume/pause states for internal/main queue need not be maintained.
    this._isPlaying = false;
  }

  //resume the player
  resume() {
    // The resume functionality of the internal queue i.e. the playlist is insignificant.
    // Different resume/pause states for internal/main queue need not be maintained.
    this._isPlaying = true;
  }

  isPlaying() {
    return this._isPlaying;
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
