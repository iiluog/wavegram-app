import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { postsApi } from '../services/apiSWR';
import { customStyles, utilities } from '../styles/appTheme';

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

      selectedImages.forEach((image, index) => {
        formData.append('images[]', image.file);
      });

      const response = await postsApi.create(formData);

      if (response.data.success) {
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
    <div className={customStyles.modal.overlay}>
      <div className={customStyles.modal.container}>
        <div className={customStyles.modal.header}>
          <h2 className={customStyles.modal.title}>Crea un post</h2>
          <button onClick={onClose} className={customStyles.modal.closeButton}>
            <X size={24} />
          </button>
        </div>

        <div className={customStyles.modal.imageUpload.container}>
          {selectedImages.length === 0 ? (
            <div className="text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <ImageIcon size={48} className="text-gray-400 mb-2" />
                <span className="text-[#1D1D1D]">Clicca qui per caricare le tue foto</span>
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
            <div className={customStyles.modal.imageUpload.preview}>
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index}`}
                    className={customStyles.modal.imageUpload.previewItem}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="cursor-pointer flex items-center justify-center h-32 bg-gray-200 rounded">
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

        <input
          type="text"
          value={location}
          readOnly
          className={customStyles.modal.input}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Scrivi una descrizione (max 200 caratteri)..."
          maxLength={200}
          className={customStyles.modal.textarea}
        />

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Errore</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <button
          onClick={handleSubmit}
          className={`${utilities.button.primary} ${!description.trim() || selectedImages.length === 0
            ? 'opacity-50 cursor-not-allowed'
            : ''
            }`}
        >
          Crea
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;