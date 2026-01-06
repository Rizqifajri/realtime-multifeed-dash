import { create } from 'zustand'
import { BaseEvent, Feed } from '@/lib/types'

interface FeedState {
  events: BaseEvent[]
  addEvent: (event: BaseEvent) => void
  clearEvents: () => void
  getFilteredEvents: (selectedFeed: Feed, searchQuery: string) => BaseEvent[]
  getEventCounts: () => Record<Feed, number>
}

export const useFeedStore = create<FeedState>((set, get) => ({
  events: [],

  addEvent: (newEvent) => set((state) => {
    //deduplication
    if (state.events.some((e) => e.id === newEvent.id)) {
      return state;
    }

    //buffer limit
    const updatedEvents = [newEvent, ...state.events].slice(0, 100);

    return { events: updatedEvents };
  }),

  clearEvents: () => set({ events: [] }),

  getFilteredEvents: (selectedFeed, searchQuery) => {
    const { events } = get(); 
    
    return events.filter((event) => {
      // filter by feed category
      const matchesFeed = selectedFeed === Feed.ALL || event.feed === selectedFeed;

      // filter by search text
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        event?.title?.toLowerCase().includes(query) ||
        (event?.body && event?.body?.toLowerCase().includes(query));
      
      return matchesFeed && matchesSearch;
    });
  },

  getEventCounts: () => {
    const { events } = get();
    const counts: Record<Feed, number> = {
      [Feed.ALL]: events.length,
      [Feed.NEWS]: 0,
      [Feed.MARKET]: 0,
      [Feed.PRICE]: 0,
    };

    events.forEach((event) => {
      if (event.feed in counts) {
        counts[event.feed]++;
      }
    });

    return counts;
  },
}))