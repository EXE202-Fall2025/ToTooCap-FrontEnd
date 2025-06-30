import React from "react";
import Layout from "../../components/Layout";

const AdminPage = () => {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Welcome to Admin Panel</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
