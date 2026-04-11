'use client';

import { useState } from 'react';
import { TimeSlot } from '@/lib/store/testCreationSlice';

interface Props {
  slots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  totalCandidates: number;
}

const emptySlot = (): TimeSlot => ({
  id: crypto.randomUUID(),
  startTime: '',
  endTime: '',
  maxCandidates: 1,
});

export default function TimeSlotsManager({ slots, onChange, totalCandidates }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TimeSlot | null>(null);

  const totalCapacity = slots.reduce((sum, s) => sum + s.maxCandidates, 0);
  const capacityWarning = totalCandidates > 0 && totalCapacity < totalCandidates;

  const startAdd = () => {
    const s = emptySlot();
    setDraft(s);
    setEditingId(s.id);
  };

  const startEdit = (slot: TimeSlot) => {
    setDraft({ ...slot });
    setEditingId(slot.id);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditingId(null);
  };

  const saveSlot = () => {
    if (!draft) return;
    if (!draft.startTime || !draft.endTime || draft.startTime >= draft.endTime) return;

    const exists = slots.find((s) => s.id === draft.id);
    if (exists) {
      onChange(slots.map((s) => (s.id === draft.id ? draft : s)));
    } else {
      onChange([...slots, draft]);
    }
    setDraft(null);
    setEditingId(null);
  };

  const removeSlot = (id: string) => onChange(slots.filter((s) => s.id !== id));

  const fmt = (dt: string) =>
    dt ? new Date(dt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '—';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Time Slots</span>
        <button
          type="button"
          onClick={startAdd}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#6633FF] text-[#6633FF] hover:bg-[#6633FF]/5 font-medium transition-colors"
        >
          + Add Slot
        </button>
      </div>

      {slots.length === 0 && editingId === null && (
        <p className="text-xs text-gray-400">No time slots defined. Candidates can start anytime.</p>
      )}

      {slots.map((slot) =>
        editingId === slot.id ? (
          <SlotForm
            key={slot.id}
            draft={draft!}
            onChange={setDraft}
            onSave={saveSlot}
            onCancel={cancelEdit}
          />
        ) : (
          <div key={slot.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-700 font-medium">{fmt(slot.startTime)} → {fmt(slot.endTime)}</span>
              <span className="text-xs text-gray-400">Max {slot.maxCandidates} candidates</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(slot)} className="text-xs text-[#6633FF] hover:underline">Edit</button>
              <button type="button" onClick={() => removeSlot(slot.id)} className="text-xs text-red-500 hover:underline">Remove</button>
            </div>
          </div>
        )
      )}

      {editingId !== null && !slots.find((s) => s.id === editingId) && draft && (
        <SlotForm draft={draft} onChange={setDraft} onSave={saveSlot} onCancel={cancelEdit} />
      )}

      {capacityWarning && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          ⚠ Total slot capacity ({totalCapacity}) is less than total candidates ({totalCandidates})
        </p>
      )}
    </div>
  );
}

function SlotForm({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: TimeSlot;
  onChange: (s: TimeSlot) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const invalid = draft.startTime && draft.endTime && draft.startTime >= draft.endTime;

  return (
    <div className="rounded-lg border border-[#6633FF]/30 bg-purple-50/30 px-4 py-3 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs text-gray-600">
          Start Time
          <input
            type="datetime-local"
            value={draft.startTime}
            onChange={(e) => onChange({ ...draft, startTime: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6633FF]/30"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-600">
          End Time
          <input
            type="datetime-local"
            value={draft.endTime}
            onChange={(e) => onChange({ ...draft, endTime: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6633FF]/30"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs text-gray-600 w-1/2">
        Max Candidates
        <input
          type="number"
          min={1}
          value={draft.maxCandidates}
          onChange={(e) => onChange({ ...draft, maxCandidates: Number(e.target.value) })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6633FF]/30"
        />
      </label>
      {invalid && <p className="text-xs text-red-500">End time must be after start time</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">Cancel</button>
        <button
          type="button"
          onClick={onSave}
          disabled={!draft.startTime || !draft.endTime || !!invalid}
          className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-50"
          style={{ backgroundColor: '#6633FF' }}
        >
          Save Slot
        </button>
      </div>
    </div>
  );
}
