import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { postsApi } from '../services/api';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Richiedi la geolocalizzazione quando il componente viene montato
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            const data = await response.json();
            setLocation(data.address.city || data.address.town || data.address.village || 'Posizione sconosciuta');
          } catch (error) {
            setError('Impossibile ottenere la posizione');
          }
        },
        () => {
          setError('Permesso per la geolocalizzazione negato');
        }
      );
    }
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Crea URL per l'anteprima delle immagini
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      // Rimuovi l'URL dell'oggetto blob per evitare memory leak
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async () => {
    // Validazione
    if (selectedImages.length === 0) {
      setError('Seleziona almeno una foto');
      return;
    }
    if (!description.trim()) {
      setError('Aggiungi una descrizione');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('location', location);
      formData.append('description', description);
      
      // Aggiungi tutte le immagini
      selectedImages.forEach((image, index) => {
        formData.append('images[]', image.file);
      });

      const response = await postsApi.create(formData);
      
      if (response.data.success) {
        // Reset e chiusura
        setDescription('');
        setSelectedImages([]);
        setError('');
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Errore durante la creazione del post. Riprova più tardi.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-lg w-full max-w-md p-4 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-white font-bold">Crea un post</h2>
          <button onClick={onClose} className="text-white">
            <X size={24} />
          </button>
        </div>

        {/* Area selezione immagini */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 min-h-[200px] flex flex-col items-center justify-center">
          {selectedImages.length === 0 ? (
            <div className="text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <ImageIcon size={48} className="text-gray-400 mb-2" />
                <span className="text-white">Clicca qui per caricare le tue foto</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 w-full">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="cursor-pointer flex items-center justify-center h-32 bg-gray-800 rounded">
                <ImageIcon size={24} className="text-gray-400" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Campo location */}
        <input
          type="text"
          value={location}
          readOnly
          className="w-full bg-gray-800 text-white p-3 rounded mb-4"
        />

        {/* Campo descrizione */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Scrivi una descrizione (max 200 caratteri)..."
          maxLength={200}
          className="w-full bg-gray-800 text-white p-3 rounded mb-4 min-h-[100px]"
        />
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Errore</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Pulsante crea */}
        <button
          onClick={handleSubmit}
          className={`w-full p-3 rounded font-medium ${
            !description.trim() || selectedImages.length === 0
              ? 'bg-gray-600 text-gray-400'
              : 'bg-blue-500 text-white'
          }`}
        >
          Crea
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;