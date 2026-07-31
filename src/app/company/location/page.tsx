import LocationPageClient from './LocationPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['location_hero','location_address','location_contact','location_transport','location_cta'];

async function getLocationContent(): Promise<Record<string, string>> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(
      `${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function LocationPage() {
  const content = await getLocationContent();
  return <LocationPageClient ssrContent={content} />;
}
