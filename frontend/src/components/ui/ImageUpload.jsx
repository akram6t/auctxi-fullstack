import { useState, useRef } from 'react';
import { IconUpload, IconX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ImageUpload = ({ value, onChange, folder = 'uploads', label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    setUploading(true);
    try {
      // Axios handles multipart/form-data boundary automatically when data is FormData
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(response.data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
        if (error.response.data.solution) {
          toast.info(error.response.data.solution);
        }
      } else {
        toast.error('Failed to upload image');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
        {label}
      </label>
      
      {value ? (
        <div className="relative inline-block">
          <img 
            src={value} 
            alt="Uploaded preview" 
            className="w-32 h-32 object-cover rounded-lg border border-secondary-300 dark:border-secondary-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150?text=Error';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            uploading 
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-secondary-300 dark:border-secondary-700 hover:border-primary-500 hover:bg-secondary-50 dark:hover:bg-secondary-800'
          }`}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          ) : (
            <>
              <IconUpload size={24} className="text-secondary-400 mb-2" />
              <span className="text-xs text-secondary-500 font-medium">Upload</span>
            </>
          )}
        </div>
      )}
      <input 
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
