LOOP LOCAL — VIDEO LIBRARY

FILES
- index.html: page content and structure
- styles.css: dark video-library design and responsive layout
- script.js: local file selection, multi-video library, search, filters, and playback
- ads-config.js: publisher and ad-unit IDs for ad placements
- ads.js: displays preview placeholders or loads configured AdSense units

OPEN AND USE
Double-click index.html to open the site. Choose “Upload videos” or “Add videos” and select one or more video files. Search by file name, use the filters, play previews, or remove videos from this session.

ADS
The page includes an ad position near the top and another in the video grid. They show “Ad space” previews until configured. To run real Google ads:
1. Publish the website at a public URL and sign in to Google AdSense.
2. Add your site and complete Google's ownership/site review. Ads cannot show until the site is approved and marked ready.
3. Create two ad units in AdSense and copy the publisher ID and each numeric ad-slot ID.
4. Put those IDs into ads-config.js (publisherId, slots.banner, and slots.library), then publish the updated files.

Leave the values blank to keep the preview placeholders. Ads require an approved account, a live site included in that account, internet access, and valid ad-unit IDs. This front-end does not itself create an AdSense account or guarantee ad serving.

STORAGE NOTE
Videos are selected from your device and previewed locally in the browser. They are not uploaded to a server, stored online, or available to other people. The local list clears when the page is closed or refreshed. Public uploads and permanent storage require a server and storage service.
