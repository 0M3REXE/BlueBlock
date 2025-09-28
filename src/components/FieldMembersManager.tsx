"use client";
import { useState } from 'react';

export interface FieldMemberRecord {
  contact_id: string;
  site_id: string;
  role: string | null;
  added_at?: string | null;
  contact: { id: string; name: string | null; email: string | null; phone: string | null };
}

interface Props {
  siteId: string;
  initialMembers: FieldMemberRecord[];
  onChange?(members: FieldMemberRecord[]): void;
}

export function FieldMembersManager({ siteId, initialMembers, onChange }: Props) {
  const [members, setMembers] = useState<FieldMemberRecord[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'member' });
  const [error, setError] = useState<string | null>(null);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/field-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_id: siteId, ...form })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      const newRec: FieldMemberRecord = {
        contact_id: data.contact.id,
        site_id: siteId,
        role: data.membership.role,
        added_at: data.membership.added_at,
        contact: { id: data.contact.id, name: data.contact.name, email: data.contact.email, phone: data.contact.phone }
      };
      const next = [...members.filter(m=>m.contact_id!==newRec.contact_id), newRec];
      setMembers(next);
      onChange?.(next);
      setForm({ name: '', email: '', phone: '', role: 'member' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally { setLoading(false); }
  }

  async function removeMember(contact_id: string) {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ site_id: siteId, contact_id });
      const res = await fetch(`/api/field-members?${params.toString()}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      const next = members.filter(m => m.contact_id !== contact_id);
      setMembers(next);
      onChange?.(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addMember} className="grid md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">Name</label>
          <input className="w-full border rounded px-2 py-1 text-sm" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">Email *</label>
            <input required type="email" className="w-full border rounded px-2 py-1 text-sm" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">Phone</label>
          <input className="w-full border rounded px-2 py-1 text-sm" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Role</label>
          <select className="w-full border rounded px-2 py-1 text-sm" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
            <option value="member">Member</option>
            <option value="lead">Lead</option>
            <option value="contractor">Contractor</option>
          </select>
        </div>
        <div>
          <button disabled={loading} className="w-full px-3 py-2 bg-black text-white rounded text-sm disabled:opacity-50">{loading ? 'Saving...' : 'Add'}</button>
        </div>
      </form>
      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Phone</th>
              <th className="px-3 py-2 text-left font-medium">Role</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.contact_id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{m.contact.name || '-'}</td>
                <td className="px-3 py-2">{m.contact.email || '-'}</td>
                <td className="px-3 py-2">{m.contact.phone || '-'}</td>
                <td className="px-3 py-2 capitalize">{m.role || '-'}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={()=>removeMember(m.contact_id)} disabled={loading} className="text-xs text-red-600 hover:underline disabled:opacity-40">Remove</button>
                </td>
              </tr>
            ))}
            {members.length===0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500 text-xs">No field members yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
