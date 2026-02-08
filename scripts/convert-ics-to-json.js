const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DateTime } = require('luxon');
const IcalExpander = require('ical-expander');

const eventZone = 'America/Chicago';

const externalImagesDir = path.join('assets', 'images', 'events', 'external');
const externalImagePublicPath = 'images/events/external';
const maxImageBytes = 6 * 1024 * 1024;
const imageUrlCache = new Map();
const pageUrlCache = new Map();

const recurringTitleMatches = [
  'GameDev Social',
  'Share & Play'
];

const contentTypeToExt = (contentType) => {
  if (!contentType) return '';
  const normalized = contentType.split(';')[0].trim().toLowerCase();
  switch (normalized) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    case 'image/svg+xml':
      return 'svg';
    default:
      return '';
  }
};

const extractFirstUrl = (text) => {
  if (!text) return '';
  const match = text.match(/https?:\/\/[^\s"<>]+/i);
  return match ? match[0] : '';
};

const extractMetaImage = (html, key) => {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["'][^>]*>`, 'i')
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) return match[1];
  }
  return '';
};

const getImageFromJsonLd = (node) => {
  if (!node) return '';
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = getImageFromJsonLd(item);
      if (found) return found;
    }
    return '';
  }

  if (node['@graph']) {
    const found = getImageFromJsonLd(node['@graph']);
    if (found) return found;
  }

  const image = node.image || node.thumbnailUrl;
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (Array.isArray(image)) return image.find(item => typeof item === 'string') || '';
  if (typeof image === 'object' && image.url) return image.url;
  return '';
};

const extractImageUrlFromHtml = (html) => {
  const ogImage = extractMetaImage(html, 'og:image') || extractMetaImage(html, 'twitter:image');
  if (ogImage) return ogImage;

  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const jsonText = match[1].trim();
    if (!jsonText) continue;
    try {
      const parsed = JSON.parse(jsonText);
      const imageUrl = getImageFromJsonLd(parsed);
      if (imageUrl) return imageUrl;
    } catch (err) {
      continue;
    }
  }

  return '';
};

const resolveUrl = (url, baseUrl) => {
  try {
    return new URL(url, baseUrl).toString();
  } catch (err) {
    return '';
  }
};

const fetchHtml = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; STLGameDevRoundUp/1.0; +https://stlgame.dev)'
      }
    });
    if (!response.ok) return '';
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return '';
    return await response.text();
  } catch (err) {
    return '';
  }
};

const downloadImage = async (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrlCache.has(imageUrl)) return imageUrlCache.get(imageUrl);

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; STLGameDevRoundUp/1.0; +https://stlgame.dev)'
      }
    });
    if (!response.ok) {
      imageUrlCache.set(imageUrl, '');
      return '';
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0 || buffer.length > maxImageBytes) {
      imageUrlCache.set(imageUrl, '');
      return '';
    }

    const contentType = response.headers.get('content-type') || '';
    let ext = contentTypeToExt(contentType);
    if (!ext) {
      const pathExt = path.extname(new URL(imageUrl).pathname).replace('.', '').toLowerCase();
      ext = pathExt || 'jpg';
    }

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const fileName = `${hash}.${ext}`;
    const filePath = path.join(externalImagesDir, fileName);

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(externalImagesDir, { recursive: true });
      fs.writeFileSync(filePath, buffer);
    }

    const publicPath = `${externalImagePublicPath}/${fileName}`;
    imageUrlCache.set(imageUrl, publicPath);
    return publicPath;
  } catch (err) {
    imageUrlCache.set(imageUrl, '');
    return '';
  }
};

const resolveEventImagePath = async (event) => {
  if (!event || !event.title) return '';
  if (recurringTitleMatches.some(match => event.title.includes(match))) return '';

  const pageUrl = event.eventUrl || extractFirstUrl(event.description || '');
  if (!pageUrl) return '';

  if (pageUrlCache.has(pageUrl)) return pageUrlCache.get(pageUrl);

  const html = await fetchHtml(pageUrl);
  if (!html) {
    pageUrlCache.set(pageUrl, '');
    return '';
  }

  const imageUrl = extractImageUrlFromHtml(html);
  const resolvedImageUrl = resolveUrl(imageUrl, pageUrl);
  const imagePath = await downloadImage(resolvedImageUrl);
  pageUrlCache.set(pageUrl, imagePath || '');
  return imagePath;
};

const main = async () => {
  // Read the .ics file
  const icsData = fs.readFileSync('calendar.ics', 'utf8');

  // Parse it
  const icalExpander = new IcalExpander({ ics: icsData, maxIterations: 1000 });

  // Define time range for events to extract
  const now = new Date();
  const future = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

  // Get expanded events (handles recurrence)
  const { events, occurrences } = icalExpander.between(now, future);

  // Combine single and recurring events
  const rawEvents = [
    ...events.map(e => ({
      title: e.summary,
      description: e.description || '',
      location: e.location || '',
      dateTime: DateTime.fromJSDate(e.startDate.toJSDate()).setZone(eventZone).toISO(),
      endTime: DateTime.fromJSDate(e.endDate.toJSDate()).setZone(eventZone).toISO(),
      eventUrl: e.url || ''
    })),
    ...occurrences.map(({ startDate, endDate, item }) => ({
      title: item.summary,
      description: item.description || '',
      location: item.location || '',
      dateTime: DateTime.fromJSDate(startDate.toJSDate()).setZone(eventZone).toISO(),
      endTime: DateTime.fromJSDate(endDate.toJSDate()).setZone(eventZone).toISO(),
      eventUrl: item.url || ''
    }))
  ];

  const enrichedEvents = await Promise.all(rawEvents.map(async (event) => {
    const imagePath = await resolveEventImagePath(event);
    return {
      ...event,
      imagePath
    };
  }));

  // Optional: sort by start time
  enrichedEvents.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  // Write to events.json
  fs.writeFileSync('data/events.json', JSON.stringify(enrichedEvents, null, 2));
};

main();
