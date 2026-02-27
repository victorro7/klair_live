
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabaseKey = supabaseServiceKey || supabaseAnonKey;
console.log(`Using ${supabaseServiceKey ? 'Service Role' : 'Anon'} Key`);

const supabase = createClient(supabaseUrl, supabaseKey!);

async function fetchDemoData() {
    console.log('Fetching clips from Supabase...');
    const { data: clips, error } = await supabase
        .from('clips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

    if (error) {
        console.error('Error fetching clips:', error);
        process.exit(1);
    }

    if (!clips || clips.length === 0) {
        console.warn('No clips found in database.');
    } else {
        console.log(`Found ${clips.length} clips.`);
    }

    // Map DB rows to Frontend Clip interface
    const mappedClips = clips!.map((row: any) => ({
        id: row.id,
        filename: row.filename,
        created: new Date(row.created_at).getTime(),
        url: row.download_url || '',
        viral_score: row.viral_score,
        description: row.description,
        reason: row.viral_reason,
        hashtags: row.hashtags,
        captions: row.captions,
        start_time: row.start_time,
        end_time: row.end_time,
        platform: row.platform,
        creator: row.creator,
        transcript: row.transcript,
        transcript_json: row.transcript_json
    }));

    // Format the data as a TypeScript constant
    const fileContent = `/**
 * Demo Data - Snapshot from Supabase
 * Generated on ${new Date().toISOString()}
 */

import { Clip } from '../app/types/clip';

export const demoClips: Clip[] = ${JSON.stringify(mappedClips, null, 4)};
`;

    const outputPath = path.resolve(__dirname, '../data/demoData.ts');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, fileContent);
    console.log(`Demo data saved to ${outputPath}`);
}

fetchDemoData();
