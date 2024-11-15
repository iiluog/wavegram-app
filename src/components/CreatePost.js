
// assicurati che il form HTML abbia l'attributo enctype="multipart/form-data" nel frontend.
const createPost = async (location, description, imageFiles) => {
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    
    // Aggiungi tutte le immagini
    imageFiles.forEach((file) => {
      formData.append('images[]', file);
    });
  
    try {
      const response = await fetch('http://your-api-url/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your-auth-token'
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('Post created:', data.post_id);
        console.log('Uploaded images:', data.images);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };