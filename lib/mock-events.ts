import { type BaseEvent, Feed } from "./types"

const NEWS_TITLES = [
  "Breaking: New AI Model Released",
  "Tech Giant Announces Major Update",
  "Industry Report: Market Trends 2024",
  "Developer Conference Announces Dates",
  "Open Source Project Reaches Milestone",
  "Security Advisory Published",
  "Platform Launches New Features",
]

const MARKET_TITLES = [
  "Trading Volume Increases",
  "Market Opens Strong",
  "New Exchange Listing Announced",
  "Quarterly Report Released",
  "Partnership Deal Signed",
  "Merger Talks Confirmed",
]

const PRICE_TITLES = [
  "Price Alert: Significant Movement",
  "New High Reached",
  "Price Correction Observed",
  "Support Level Tested",
  "Resistance Broken",
  "Volume Spike Detected",
]

const BODIES = [
  "This is an important update that requires immediate attention from all stakeholders.",
  "Further details will be made available in the coming hours.",
  "Analysts are closely monitoring the situation for additional developments.",
  "The announcement has been well-received by the community.",
  "Industry experts predict significant implications.",
]

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateEventForFeed(feed: Feed): BaseEvent {
  let title: string

  switch (feed) {
    case Feed.NEWS:
      title = getRandomItem(NEWS_TITLES)
      break
    case Feed.MARKET:
      title = getRandomItem(MARKET_TITLES)
      break
    case Feed.PRICE:
      title = getRandomItem(PRICE_TITLES)
      break
    default:
      title = getRandomItem([...NEWS_TITLES, ...MARKET_TITLES, ...PRICE_TITLES])
  }

  return {
    id: `${feed}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    feed,
    ts: Date.now(),
    title,
    body: Math.random() > 0.5 ? getRandomItem(BODIES) : undefined,
  }
}

export function generateRandomEvent(): BaseEvent {
  const feeds = [Feed.NEWS, Feed.MARKET, Feed.PRICE]
  const randomFeed = getRandomItem(feeds)
  return generateEventForFeed(randomFeed)
}

export function generateMalformedEvent(): Partial<BaseEvent> | string {
  const rand = Math.random()

  if (rand < 0.33) {
    return "invalid json string"
  } else if (rand < 0.66) {
    return { id: "missing-fields" }
  } else {
    return { ...generateRandomEvent(), id: undefined }
  }
}
