let searchQuery = '';

let subscribers: Array <() => void> = [];

export const searchStore = {
  getSnapshot() {
    return searchQuery;
  },
  changeSnapshot(newSearchQuery: string){
    searchQuery = newSearchQuery;
    subscribers.forEach(func => func());
  },
  subscribe(listener: ()=> void){
    subscribers.push(listener);

    return () => {
      subscribers = subscribers.filter((l) => l!=listener);
    }
  }
}