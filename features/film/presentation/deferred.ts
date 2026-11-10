// A transparent pixel: the placeholder of a deferred image that has no proof of its own, so the ink field behind it shows.
export const DEFERRED_BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

// A deferred image or video: PlateLoader gives it its real sources as the visitor nears it, nearest first, a few at a time.
export const DEFERRED_SELECTOR = "img[data-srcset]:not([data-loaded]), img[data-src]:not([data-loaded]), video[data-src]:not([data-loaded])"
