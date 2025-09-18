import { supabase } from "@/integrations/supabase/client";

export async function uploadLoveTrack() {
  try {
    // Read the Love.mp3 file from the public folder
    const response = await fetch('/uploads/Love.mp3');
    if (!response.ok) {
      throw new Error('Failed to fetch Love.mp3 file');
    }
    
    const blob = await response.blob();
    const fileName = `love-${Date.now()}.mp3`;
    
    console.log('Uploading Love.mp3 to Supabase storage...');
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(fileName, blob, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('audio-files')
      .getPublicUrl(fileName);

    console.log('Public URL:', urlData.publicUrl);

    // Update the track record with the correct URL
    const { error: updateError } = await (supabase as any)
      .from('tracks')
      .update({ 
        audio_file_url: urlData.publicUrl,
        status: 'ready'
      })
      .eq('title', 'Love');

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    console.log('Track record updated successfully');
    return {
      success: true,
      url: urlData.publicUrl,
      fileName: data.path
    };

  } catch (error) {
    console.error('Error uploading Love track:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}