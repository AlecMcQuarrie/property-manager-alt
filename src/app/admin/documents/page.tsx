'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Trash2, 
  Calendar
} from 'lucide-react';
import { User } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui';

// Mock document data
const demoDocuments = [
  {
    id: 'doc-1',
    name: 'Lease Agreement - 123 Main Street',
    type: 'Lease',
    uploadedAt: '2024-01-10',
    url: '#',
  },
  {
    id: 'doc-2',
    name: 'Move-in Checklist',
    type: 'Form',
    uploadedAt: '2024-01-12',
    url: '#',
  },
  {
    id: 'doc-3',
    name: 'Pet Policy',
    type: 'Policy',
    uploadedAt: '2024-01-15',
    url: '#',
  },
  {
    id: 'doc-4',
    name: 'Maintenance Request Form',
    type: 'Form',
    uploadedAt: '2024-01-18',
    url: '#',
  },
];

export default function AdminDocuments() {
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState(demoDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'admin') {
        setUser(parsedUser);
      } else {
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  const stats = [
    {
      name: 'Total Documents',
      value: documents.length,
      icon: FileText,
    },
    {
      name: 'Leases',
      value: documents.filter(d => d.type === 'Lease').length,
      icon: FileText,
    },
    {
      name: 'Forms',
      value: documents.filter(d => d.type === 'Form').length,
      icon: FileText,
    },
    {
      name: 'Policies',
      value: documents.filter(d => d.type === 'Policy').length,
      icon: FileText,
    },
  ];

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e7eb]">Documents</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage property-related documents, leases, and forms
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">{stat.name}</dt>
                      <dd className="text-lg font-medium text-[#e5e7eb]">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#22304a] border border-[#22304a] rounded-lg text-[#e5e7eb] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#22304a] border border-[#22304a] rounded-lg px-3 py-2 text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="Lease">Lease</option>
                  <option value="Form">Form</option>
                  <option value="Policy">Policy</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#22304a]">
                <thead className="bg-[#181c23]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#181c23] divide-y divide-[#22304a]">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#22304a] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-400 mr-3" />
                          <span className="text-sm font-medium text-[#e5e7eb]">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {doc.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-400">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by uploading your first document.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 