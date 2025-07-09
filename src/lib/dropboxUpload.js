export const uploadAudioToDropbox = async (file) => {
  const DROPBOX_TOKEN = import.meta.env.VITE_DROPBOX_TOKEN;
  
  if (!DROPBOX_TOKEN) {
    throw new Error("Dropbox access token is missing");
  }

  try {
    // 1. Upload the file
    const uploadResponse = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/voice_notes/voice_${Date.now()}.${file.name.split('.').pop() || 'webm'}`,
          mode: 'add',
          autorename: true
        })
      },
      body: file
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.error_summary || "Upload failed");
    }

    const uploadData = await uploadResponse.json();

    // 2. Get a direct download link
    const linkResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: uploadData.path_display,
        settings: {
          requested_visibility: 'public'
        }
      })
    });

    const linkData = await linkResponse.json();
    
    // Return direct download link
    return linkData.url.replace('dl=0', 'raw=1');
    
  } catch (error) {
    console.error('Dropbox error:', error);
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
};