'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Tabs } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useStations } from '@/hooks/use-stations';
import { useFacilities } from '@/hooks/use-facilities';
import { useDocuments } from '@/hooks/use-documents';
import { useComplaints } from '@/hooks/use-complaints';
import { useToast } from '@/hooks/use-toast';
import {
  ShieldAlert,
  Building2,
  MapPin,
  FileText,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { ComplaintStatus } from '@/types/complaint';

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('stations');

  // Hooks data
  const { stations } = useStations();
  const { facilities } = useFacilities();
  const { documents } = useDocuments();
  const { complaints, updateStatus } = useComplaints();

  // Dialog states
  const [isAddStationOpen, setIsAddStationOpen] = React.useState(false);
  const [isAddFacilityOpen, setIsAddFacilityOpen] = React.useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = React.useState(false);

  // Form mock states
  const [newStationName, setNewStationName] = React.useState('');
  const [newStationCode, setNewStationCode] = React.useState('');

  const [newFacilityName, setNewFacilityName] = React.useState('');
  const [newFacilityStation, setNewFacilityStation] = React.useState('NDLS');

  const [newDocTitle, setNewDocTitle] = React.useState('');
  const [newDocCircular, setNewDocCircular] = React.useState('');

  const handleAddStation = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Station Added (Demo)',
      description: `${newStationName} (${newStationCode.toUpperCase()}) added to directory.`,
      type: 'success',
    });
    setNewStationName('');
    setNewStationCode('');
    setIsAddStationOpen(false);
  };

  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Facility Added (Demo)',
      description: `${newFacilityName} linked to ${newFacilityStation}.`,
      type: 'success',
    });
    setNewFacilityName('');
    setIsAddFacilityOpen(false);
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Circular Indexed (Demo)',
      description: `${newDocTitle} added to RAG vector database.`,
      type: 'success',
    });
    setNewDocTitle('');
    setNewDocCircular('');
    setIsAddDocOpen(false);
  };

  const handleComplaintStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    await updateStatus(id, newStatus, 'Station Duty Officer (Admin Console)');
    toast({
      title: 'Complaint Status Updated',
      description: `Grievance status marked as ${newStatus.replace('_', ' ').toUpperCase()}`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'System Administration' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Station Master &amp; Admin Operations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage station schematics, facility coordinates, verified RAG documents, and passenger grievances.
          </p>
        </div>

        <Badge variant="rail" size="md">
          Staff Console (Authorized)
        </Badge>
      </div>

      {/* Tabs Control */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'stations', label: `Stations (${stations.length})`, icon: Building2 },
          { id: 'facilities', label: `Facilities (${facilities.length})`, icon: MapPin },
          { id: 'documents', label: `RAG Documents (${documents.length})`, icon: FileText },
          { id: 'complaints', label: `Grievance Redressal (${complaints.length})`, icon: AlertTriangle },
        ]}
      />

      {/* 1. STATIONS MANAGEMENT TAB */}
      {activeTab === 'stations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Station Terminal Schematics
            </h3>
            <Button size="sm" onClick={() => setIsAddStationOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              <span>Add Station</span>
            </Button>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5 font-semibold">Station Code</th>
                  <th className="p-3.5 font-semibold">Station Name</th>
                  <th className="p-3.5 font-semibold">Location</th>
                  <th className="p-3.5 font-semibold">Platforms</th>
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stations.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {s.code}
                    </td>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {s.name}
                    </td>
                    <td className="p-3.5 text-slate-500">{s.city}, {s.state}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-semibold">
                      {s.platformsCount}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="secondary" size="sm">Category {s.category}</Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast({ title: 'Edit Mode', description: `Editing ${s.code}` })}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast({ title: 'Station Locked', description: 'Core stations cannot be deleted in demo.' })}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* 2. FACILITIES MANAGEMENT TAB */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Station Amenities &amp; Services
            </h3>
            <Button size="sm" onClick={() => setIsAddFacilityOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              <span>Add Facility</span>
            </Button>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5 font-semibold">Facility Name</th>
                  <th className="p-3.5 font-semibold">Type</th>
                  <th className="p-3.5 font-semibold">Station</th>
                  <th className="p-3.5 font-semibold">Location Area</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {facilities.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {f.name}
                    </td>
                    <td className="p-3.5 capitalize text-slate-500">
                      {f.type.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 font-mono text-blue-600 dark:text-blue-400">
                      {f.stationCode}
                    </td>
                    <td className="p-3.5 text-slate-500 truncate max-w-xs">
                      PF {f.platformNear} • {f.exactLocation}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={f.status === 'available' ? 'success' : 'warning'} size="sm">
                        {f.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast({ title: 'Edit Mode', description: `Editing ${f.name}` })}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* 3. DOCUMENTS MANAGEMENT TAB */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Commercial Circulars &amp; RAG Index
            </h3>
            <Button size="sm" onClick={() => setIsAddDocOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              <span>Index New Circular</span>
            </Button>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5 font-semibold">Circular No</th>
                  <th className="p-3.5 font-semibold">Title</th>
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold">Effective Date</th>
                  <th className="p-3.5 font-semibold">RAG Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {d.circularNumber}
                    </td>
                    <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {d.title}
                    </td>
                    <td className="p-3.5 capitalize text-slate-500">{d.category}</td>
                    <td className="p-3.5 text-slate-500">{d.effectiveDate}</td>
                    <td className="p-3.5">
                      <Badge variant="success" size="sm">Active in Vector DB</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* 4. GRIEVANCE REDRESSAL TAB */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Station Complaints &amp; Action Dispatch
            </h3>
            <span className="text-xs text-slate-400">
              Target SLA: 45 Minutes
            </span>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5 font-semibold">Tracking ID</th>
                  <th className="p-3.5 font-semibold">Station / PF</th>
                  <th className="p-3.5 font-semibold">Issue Summary</th>
                  <th className="p-3.5 font-semibold">Urgency</th>
                  <th className="p-3.5 font-semibold">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {c.trackingId}
                    </td>
                    <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {c.stationCode} • PF {c.platform || 'Gen'}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 max-w-xs">
                      <p className="font-semibold truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{c.description}</p>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={c.urgency === 'emergency' ? 'danger' : c.urgency === 'urgent' ? 'warning' : 'outline'}
                        size="sm"
                        className="uppercase"
                      >
                        {c.urgency}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={c.status}
                        onChange={(e) => handleComplaintStatusChange(c.id, e.target.value as ComplaintStatus)}
                        className="h-8 px-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Add Station Dialog */}
      <Dialog
        isOpen={isAddStationOpen}
        onClose={() => setIsAddStationOpen(false)}
        title="Add Railway Station Terminal"
      >
        <form onSubmit={handleAddStation} className="space-y-4">
          <Input
            label="Station Name"
            value={newStationName}
            onChange={(e) => setNewStationName(e.target.value)}
            placeholder="e.g. Pune Junction"
            required
          />
          <Input
            label="Station Code"
            value={newStationCode}
            onChange={(e) => setNewStationCode(e.target.value)}
            placeholder="e.g. PUNE"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAddStationOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Station</Button>
          </div>
        </form>
      </Dialog>

      {/* Add Facility Dialog */}
      <Dialog
        isOpen={isAddFacilityOpen}
        onClose={() => setIsAddFacilityOpen(false)}
        title="Add Station Amenity / Facility"
      >
        <form onSubmit={handleAddFacility} className="space-y-4">
          <Input
            label="Facility Name"
            value={newFacilityName}
            onChange={(e) => setNewFacilityName(e.target.value)}
            placeholder="e.g. Jan Aahar Cafeteria"
            required
          />
          <Select
            label="Station"
            value={newFacilityStation}
            onChange={(e) => setNewFacilityStation(e.target.value)}
            options={stations.map((s) => ({ value: s.code, label: `${s.code} - ${s.name}` }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAddFacilityOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Facility</Button>
          </div>
        </form>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog
        isOpen={isAddDocOpen}
        onClose={() => setIsAddDocOpen(false)}
        title="Index Railway Commercial Circular"
      >
        <form onSubmit={handleAddDoc} className="space-y-4">
          <Input
            label="Document Title"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            placeholder="e.g. Special Concession Norms for Athletes"
            required
          />
          <Input
            label="Circular Number"
            value={newDocCircular}
            onChange={(e) => setNewDocCircular(e.target.value)}
            placeholder="e.g. CC-45 of 2026"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAddDocOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Index Document</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
