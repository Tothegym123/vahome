import { NextRequest, NextResponse } from 'next/server';
import { videoMarkers } from '@/app/lib/listings';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

interface NeighborhoodTour {
  id: string;
  title: string;
  youtube_url: string;
  lat: number;
  lng: number;
  neighborhood: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get bounds from query params
    const sw_lat = parseFloat(searchParams.get('sw_lat') || '0');
    const sw_lng = parseFloat(searchParams.get('sw_lng') || '0');
    const ne_lat = parseFloat(searchParams.get('ne_lat') || '90');
    const ne_lng = parseFloat(searchParams.get('ne_lng') || '0');

    let videos: NeighborhoodTour[] = [];

    // Try Supabase first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from('neighborhood_tours')
          .select('id, title, youtube_url, lat, lng, neighborhood')
          .gte('lat', sw_lat)
          .lte('lat', ne_lat)
          .gte('lng', sw_lng)
          .lte('lng', ne_lng);

        if (error) {
          console.warn('Supabase query error:', error);
        } else if (data && data.length > 0) {
          videos = data as NeighborhoodTour[];
        }
      } catch (supabaseError) {
        console.warn('Supabase connection failed, falling back to hardcoded videos:', supabaseError);
      }
    }

    // Fallback to hardcoded videoMarkers if Supabase returns nothing
    if (videos.length === 0) {
      videos = videoMarkers
        .filter((video) => {
          return video.lat >= sw_lat && video.lat <= ne_lat && video.lng >= sw_lng && video.lng <= ne_lng;
        })
        .map((video) => ({
          id: video.videoId,
          title: video.title,
          youtube_url: `https://www.youtube.com/watch?v=${video.videoId}`,
          lat: video.lat,
          lng: video.lng,
          neighborhood: video.description,
        }));
    }

    return NextResponse.json({
      videos,
    });
  } catch (error) {
    console.error('Error in map-videos route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos', videos: [] },
      { status: 500 }
    );
  }
}
