import { generateRandomEvent, generateMalformedEvent } from "@/lib/mock-events"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  const encoder = new TextEncoder()

  const signal = request.signal

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false
      const intervals: NodeJS.Timeout[] = []

      const sendEvent = (data: unknown) => {
        if (isClosed) return
        try {
          const message = `id: ${Date.now()}\nevent: message\ndata: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (e) {
          cleanup()
        }
      }

      // Keep-alive heartbeat
      intervals.push(
        setInterval(() => {
          if (isClosed) return
          try {
            controller.enqueue(encoder.encode(": keepalive\n\n"))
          } catch (e) {
            cleanup()
          }
        }, 15000),
      )

      // Event generation
      intervals.push(
        setInterval(() => {
          if (isClosed) return
          try {
            const event = Math.random() < 0.1 ? generateMalformedEvent() : generateRandomEvent()
            sendEvent({ type: "event", data: event })
          } catch (error) {
            console.error("Error generating event:", error)
          }
        }, 2000),
      )

      const cleanup = () => {
        if (isClosed) return
        console.log("Cleaning up SSE stream")
        isClosed = true
        intervals.forEach(clearInterval)
        try {
          controller.close()
        } catch (e) {}
      }

      signal.addEventListener("abort", cleanup)

      console.log("SSE Stream started")
    },
    cancel() {
      console.log("SSE Stream cancelled by client")
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform, no-store, must-revalidate",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
