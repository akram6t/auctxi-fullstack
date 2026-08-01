import TeamProfileForm from './components/TeamProfileForm';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
            Franchise Profile
          </h1>
          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 font-medium">
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
