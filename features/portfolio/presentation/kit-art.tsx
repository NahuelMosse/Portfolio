type KitArtProps = { sources: { desktop: string; mobile: string } }

// The kit's illustration: printed on the crimson field behind its diagram on a wide screen, and as a band closing the
// poster on a phone. It has no device, so it carries no interface.
export function KitArt({ sources }: KitArtProps) {
  return (
    <div data-printed-art="" className="kit-art" aria-hidden="true">
      <img data-art="desktop" src={sources.desktop} alt="" loading="lazy" decoding="async" />
      <img data-art="mobile" src={sources.mobile} alt="" loading="lazy" decoding="async" />
    </div>
  )
}
