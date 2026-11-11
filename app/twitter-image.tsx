import { shareCard, shareCardAlt, shareCardSize } from "@/lib/share-card"

export const alt = shareCardAlt
export const size = shareCardSize
export const contentType = "image/png"

export default function Image() {
  return shareCard()
}
