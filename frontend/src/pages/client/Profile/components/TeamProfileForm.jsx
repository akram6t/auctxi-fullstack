import { useState, useEffect, useRef } from 'react';
import { IconUpload, IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';

const TeamProfileForm = () => {
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [teamId, setTeamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    ownerName: '',
    ownerEmail: '',
    purse: '0',
    squadSize: 0,
    logoUrl: ''
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!user?.email) return;
        const res = await api.get('/teams');
        const myTeam = res.data.find(t => t.ownerEmail?.toLowerCase() === user.email?.toLowerCase());
        
        if (myTeam) {
          setTeamId(myTeam.id);
          setFormData({
            name: myTeam.name || '',
            shortName: myTeam.shortName || '',
            ownerName: myTeam.ownerName || '',
            ownerEmail: myTeam.ownerEmail || '',
            purse: myTeam.purse || '0',
            squadSize: myTeam.squadSize || 0,
            logoUrl: myTeam.logoUrl || ''
          });
          if (myTeam.logoUrl) setPreviewUrl(myTeam.logoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch team details", err);
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be less than 2MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSaving(true);
    try {
      let finalLogoUrl = formData.logoUrl;

      // 1. Upload to S3 if a new file is selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        uploadData.append('folder', 'franchises');
        
        // We use multipart/form-data headers automatically set by axios for FormData
        const uploadRes = await api.post('/upload', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (uploadRes.data && uploadRes.data.url) {
          finalLogoUrl = uploadRes.data.url;
        } else {
          throw new Error("Upload failed to return URL");
        }
      }

      // 2. Save profile to DB
      const updatedData = { ...formData, logoUrl: finalLogoUrl };
      
      let savedTeam;
      if (teamId) {
        // Update existing team
        const res = await api.put(`/teams/${teamId}`, updatedData);
        savedTeam = res.data;
      } else {
        // Create new team
        // Ensure the ownerEmail is set to the current user's email if they didn't fill it out
        updatedData.ownerEmail = updatedData.ownerEmail || user.email;
        updatedData.status = "Active"; // Default status
        const res = await api.post(`/teams`, updatedData);
        savedTeam = res.data;
        setTeamId(savedTeam.id);
      }
      
      // Update local state to reflect successful save
      setFormData({
        name: savedTeam.name || '',
        shortName: savedTeam.shortName || '',
        ownerName: savedTeam.ownerName || '',
        ownerEmail: savedTeam.ownerEmail || '',
        purse: savedTeam.purse || '0',
        squadSize: savedTeam.squadSize || 0,
        logoUrl: savedTeam.logoUrl || ''
      });
      setSelectedFile(null);
      
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update team", err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-secondary-500">Loading profile details...</div>;
  }

  return (
    <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Branding Section */}
        <div>
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Franchise Branding</h3>
          <p className="mt-1 text-sm font-medium text-secondary-500 dark:text-secondary-400">
            This information will be displayed publicly during live auctions.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label className="block text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-2">Team Logo</label>
              <div className="mt-2 flex items-center">
                <span className="h-24 w-24 rounded-3xl overflow-hidden bg-secondary-100 dark:bg-secondary-800/50 border-2 border-white dark:border-secondary-700 shadow-md flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Team Logo" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-10 w-10 text-secondary-300 dark:text-secondary-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleLogoChange}
                  className="hidden" 
                />
                <button type="button" onClick={handleLogoClick} className="ml-6 bg-white dark:bg-secondary-800 py-3 px-5 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-sm text-sm font-bold text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <IconUpload size={18} /> Change Logo
                </button>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-2">
                Franchise Name
              </label>
              <div className="mt-1">
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="appearance-none block w-full px-4 py-3.5 border-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] placeholder-secondary-400 text-secondary-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:text-base bg-secondary-50 dark:bg-secondary-800/50 transition-all font-semibold" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="shortName" className="block text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-2">
                Abbreviation (Short Name)
              </label>
              <div className="mt-1">
                <input type="text" id="shortName" name="shortName" value={formData.shortName} onChange={handleChange} className="appearance-none block w-full px-4 py-3.5 border-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] placeholder-secondary-400 text-secondary-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:text-base bg-secondary-50 dark:bg-secondary-800/50 transition-all uppercase font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="pt-8 border-t border-secondary-200/50 dark:border-secondary-800/50">
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Manager Contact Details</h3>
          <p className="mt-1 text-sm font-medium text-secondary-500 dark:text-secondary-400">
            Primary contact for billing and event updates.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="ownerName" className="block text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-2">
                Full Name
              </label>
              <div className="mt-1">
                <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} className="appearance-none block w-full px-4 py-3.5 border-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] placeholder-secondary-400 text-secondary-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:text-base bg-secondary-50 dark:bg-secondary-800/50 transition-all font-medium" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="ownerEmail" className="block text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-2">
                Email Address
              </label>
              <div className="mt-1">
                <input type="email" id="ownerEmail" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="appearance-none block w-full px-4 py-3.5 border-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] placeholder-secondary-400 text-secondary-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:text-base bg-secondary-50 dark:bg-secondary-800/50 transition-all font-medium" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="pt-6 border-t border-secondary-200/50 dark:border-secondary-800/50 flex justify-end">
          <button type="button" className="bg-white dark:bg-secondary-800 py-3 px-6 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-sm text-sm font-bold text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none transition-all mr-4 hover:-translate-y-0.5">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex justify-center items-center gap-2 py-3 px-6 shadow-md hover:shadow-lg text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 focus:outline-none transition-all hover:-translate-y-0.5 disabled:opacity-50">
            {saving ? <IconLoader2 size={18} className="animate-spin" /> : <IconDeviceFloppy size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default TeamProfileForm;
