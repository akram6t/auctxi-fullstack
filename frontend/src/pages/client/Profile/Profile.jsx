import TeamProfileForm from './components/TeamProfileForm';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Franchise Profile
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Update your team details, branding, and contact information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <TeamProfileForm />
      </div>
    </div>
  );
};

export default Profile;
