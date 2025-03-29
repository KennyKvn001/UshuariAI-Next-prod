"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import { Organization } from "@/types/index";

// Mock data for organizations
const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Legal Experts LLC",
    email: "contact@legalexperts.com",
    description: "Specializing in employment and contract law",
    status: "approved",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    contactPerson: "Jane Smith",
    specialties: ["Employment Law", "Contract Law"],
  },
  {
    id: "org-2",
    name: "Tenant Rights Group",
    email: "help@tenantrightsgroup.org",
    description: "Advocating for tenant rights and housing issues",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    contactPerson: "Michael Johnson",
    specialties: ["Housing Law", "Tenant Rights"],
  },
  {
    id: "org-3",
    name: "Family Law Partners",
    email: "info@familylawpartners.com",
    description: "Legal assistance with family law matters",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    contactPerson: "Robert Wilson",
    specialties: ["Family Law", "Divorce", "Child Custody"],
  },
];

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  // Check authentication on load
  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/auth/login");
      } else if (user?.role !== "admin") {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "organization") {
          router.push("/organization/dashboard");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        }
      } else {
        // Load organizations
        setOrganizations(MOCK_ORGANIZATIONS);
        setIsLoading(false);
      }
    };

    init();
  }, [checkAuth, router, user]);

  const updateOrganizationStatus = (
    orgId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId ? { ...org, status: newStatus } : org
      )
    );
    toast.success(`Organization ${newStatus}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Total Organizations</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {organizations.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {organizations.filter((org) => org.status === "pending").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Approved</h3>
          <p className="text-3xl font-bold text-green-500">
            {organizations.filter((org) => org.status === "approved").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Organizations</h2>
          <button
            onClick={() => router.push("/admin/organizations")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View All Organizations
          </button>
        </div>

        {organizations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No organizations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Organization
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org) => (
                  <tr key={org.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {org.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {org.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {org.contactPerson}
                      </div>
                      <div className="text-sm text-gray-500">{org.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          org.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : org.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/organizations/${org.id}`)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        {org.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateOrganizationStatus(org.id, "approved")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateOrganizationStatus(org.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
