import { IconUpload, IconDeviceFloppy } from '@tabler/icons-react';

const TeamProfileForm = () => {
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6">
      <form className="space-y-8">
        
        {/* Branding Section */}
        <div>
          <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">Franchise Branding</h3>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            This information will be displayed publicly during live auctions.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Team Logo</label>
              <div className="mt-2 flex items-center">
                <span className="h-20 w-20 rounded-full overflow-hidden bg-secondary-100 dark:bg-secondary-800">
                  <svg className="h-full w-full text-secondary-300 dark:text-secondary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <button type="button" className="ml-5 bg-white dark:bg-secondary-800 py-2 px-3 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-sm leading-4 font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center gap-2">
                  <IconUpload size={16} /> Change Logo
                </button>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="team-name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Franchise Name
              </label>
              <div className="mt-1">
                <input type="text" id="team-name" defaultValue="Chennai Super Kings" className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="short-name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Abbreviation (Short Name)
              </label>
              <div className="mt-1">
                <input type="text" id="short-name" defaultValue="CSK" className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white uppercase" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="pt-8 border-t border-secondary-200 dark:border-secondary-800">
          <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">Manager Contact Details</h3>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Primary contact for billing and event updates.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="manager-name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Full Name
              </label>
              <div className="mt-1">
                <input type="text" id="manager-name" defaultValue="Stephen Fleming" className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Email Address
              </label>
              <div className="mt-1">
                <input type="email" id="email" defaultValue="management@csk.com" className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="pt-5 border-t border-secondary-200 dark:border-secondary-800 flex justify-end">
          <button type="button" className="bg-white dark:bg-secondary-800 py-2 px-4 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3 transition-colors">
            Cancel
          </button>
          <button type="submit" className="inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <IconDeviceFloppy size={18} /> Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};

export default TeamProfileForm;
