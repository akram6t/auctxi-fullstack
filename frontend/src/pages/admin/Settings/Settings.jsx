import SystemSettingsForm from './components/SystemSettingsForm';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          System Settings
        </h1>
        <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
          Configure global auction rules, platform preferences, and maintenance options.
        </p>
      </div>

      <SystemSettingsForm />
    </div>
  );
};

export default Settings;
