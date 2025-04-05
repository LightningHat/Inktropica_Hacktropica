import { UserProfile } from "@clerk/clerk-react";

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold text-blue-600">User Dashboard</h2>
      <p className="text-gray-700 mt-4">Welcome to Inktropica! Here is your profile:</p>
      <div className="mt-6">
        <UserProfile />
      </div>
    </div>
  );
}

export default Dashboard;
