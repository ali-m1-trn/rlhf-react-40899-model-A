import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function App() {
  const [entries, setEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleEntries = entries.slice(-7); // Last 7 entries

  const moveIndex = (direction) => {
    setCurrentIndex(prev => Math.max(0, Math.min(prev + direction, entries.length - 1)));
  };

  const updateEntry = (index, calories, limit) => {
    setEntries(prevEntries => {
      let newEntries = [...prevEntries];
      newEntries[index] = { calories, limit, surplus: calories > limit };
      return newEntries;
    });
  };

  const addEntry = (calories, limit) => {
    setEntries(prev => [...prev, { calories, limit, surplus: calories > limit }]);
    setCurrentIndex(entries.length); // Move to the new entry
  };

  const currentEntry = entries[currentIndex] || { calories: 0, limit: 0 };

  const totals = useMemo(() => {
    const lastSeven = entries.slice(-7);
    const totalDeficit = lastSeven.filter(e => e.calories < e.limit).length;
    const totalSurplus = lastSeven.length - totalDeficit;
    return { totalDeficit, totalSurplus };
  }, [entries]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Caloric Intake Tracker</h1>
      
      {/* Table Section */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <Button onClick={() => moveIndex(-1)} disabled={currentIndex === 0}>Previous</Button>
          <Button onClick={() => moveIndex(1)} disabled={currentIndex >= entries.length - 1}>Next</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Calories</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleEntries.map((entry, i) => (
              <TableRow key={i}>
                <TableCell>{entry.calories}</TableCell>
                <TableCell>{entry.limit}</TableCell>
                <TableCell>{entry.surplus ? 'Surplus' : 'Deficit'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Section */}
      <div className="space-y-4">
        <Input 
          type="number" 
          value={currentEntry.calories} 
          onChange={(e) => updateEntry(currentIndex, Number(e.target.value), currentEntry.limit)} 
          placeholder="Enter calories (kcal)"
        />
        <div className="flex space-x-2">
          <Button onClick={() => moveIndex(-1)}>Prev Entry</Button>
          <Button onClick={() => moveIndex(1)}>Next Entry</Button>
        </div>
        <Button onClick={() => addEntry(0, 0)}>New Entry</Button>
        <Input 
          type="number" 
          value={currentEntry.limit} 
          onChange={(e) => updateEntry(currentIndex, currentEntry.calories, Number(e.target.value))} 
          placeholder="Set caloric limit (kcal)"
        />
        <p>Deficit: {totals.totalDeficit} | Surplus: {totals.totalSurplus}</p>
      </div>
    </div>
  );
}

export default App;