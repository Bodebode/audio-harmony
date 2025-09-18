import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const trackId = formData.get('trackId') as string;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    
    // Convert file to array buffer
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(fileName, fileBuffer, {
        contentType: file.type || 'audio/mpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully:', uploadData.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('audio-files')
      .getPublicUrl(fileName);

    console.log('Public URL:', urlData.publicUrl);

    // Update track record if trackId provided
    if (trackId) {
      const { error: updateError } = await supabase
        .from('tracks')
        .update({ 
          audio_file_url: urlData.publicUrl,
          status: 'ready'
        })
        .eq('id', trackId);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }
      
      console.log('Track updated with audio URL');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: urlData.publicUrl,
        path: uploadData.path
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in upload-audio function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Upload failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});