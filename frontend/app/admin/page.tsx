"use client";

import { useState, useEffect } from 'react';

// Define types locally based on Prisma schema
type StructureType = 'ROAD' | 'BRIDGE' | 'PIPELINE' | 'SUBSTATION' | 'BUILDING';
type SensorType = 'WATER_METER' | 'PRESSURE_SENSOR' | 'ENERGY_METER';

interface Structure {
  id: string;
  name: string;
  type: StructureType;
  location: string;
  _count: {
    sensors: number;
  };
  sensors: Array<{
    id: string;
    sensorCode: string;
    sensorType: SensorType;
    isActive: boolean;
    isSubscribed: boolean;
  }>;
}

interface Sensor {
  id: string;
  sensorCode: string;
  sensorType: SensorType;
  isActive: boolean;
  isSubscribed: boolean;
  topicName: string;
  structure: {
    name: string;
    type: StructureType;
  };
}

export default function AdminPage() {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateStructure, setShowCreateStructure] = useState(false);
  const [showCreateSensor, setShowCreateSensor] = useState(false);

  const [structureForm, setStructureForm] = useState({
    name: '',
    type: 'ROAD' as StructureType,
    location: '',
    zone: '',
    latitude: '',
    longitude: ''
  });

  const [sensorForm, setSensorForm] = useState({
    sensorCode: '',
    sensorType: 'WATER_METER' as SensorType,
    structureId: '',
    topicName: '',
    zone: '',
    latitude: '',
    longitude: ''
  });

  // Predefined structure and sensor configurations
  const defaultStructures = [
    { name: 'Mumbai Water Treatment Plant', type: 'PIPELINE', location: 'Bhandup, Mumbai' },
    { name: 'Andheri Power Substation', type: 'SUBSTATION', location: 'Andheri West, Mumbai' },
    { name: 'Western Express Highway Bridge', type: 'BRIDGE', location: 'Kandivali, Mumbai' },
    { name: 'Colaba Gas Pipeline', type: 'PIPELINE', location: 'Colaba, Mumbai' }
  ];

  const sensorTopicMapping = {
    WATER_METER: 'iot.telemetry.water',
    PRESSURE_SENSOR: 'iot.telemetry.pressure',
    ENERGY_METER: 'iot.telemetry.energy'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [structuresRes, sensorsRes] = await Promise.all([
        fetch('/api/structures'),
        fetch('/api/sensors')
      ]);

      const structuresData = await structuresRes.json();
      const sensorsData = await sensorsRes.json();

      if (structuresData.success) setStructures(structuresData.data);
      if (sensorsData.success) setSensors(sensorsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/structures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...structureForm,
          latitude: structureForm.latitude ? parseFloat(structureForm.latitude) : undefined,
          longitude: structureForm.longitude ? parseFloat(structureForm.longitude) : undefined
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Structure created successfully!');
        setShowCreateStructure(false);
        setStructureForm({
          name: '',
          type: 'ROAD' as StructureType,
          location: '',
          zone: '',
          latitude: '',
          longitude: ''
        });
        fetchData();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating structure:', error);
      alert('Failed to create structure');
    }
  };

  const createSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sensors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sensorForm,
          latitude: sensorForm.latitude ? parseFloat(sensorForm.latitude) : undefined,
          longitude: sensorForm.longitude ? parseFloat(sensorForm.longitude) : undefined
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Sensor created successfully!');
        setShowCreateSensor(false);
        setSensorForm({
          sensorCode: '',
          sensorType: 'WATER_METER' as SensorType,
          structureId: '',
          topicName: '',
          zone: '',
          latitude: '',
          longitude: ''
        });
        fetchData();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating sensor:', error);
      alert('Failed to create sensor');
    }
  };

  const createDefaultStructures = async () => {
    if (!confirm('Create 4 default structures for IoT demo?')) return;

    for (const structure of defaultStructures) {
      try {
        await fetch('/api/structures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(structure)
        });
      } catch (error) {
        console.error('Error creating default structure:', error);
      }
    }
    
    alert('Default structures created!');
    fetchData();
  };

  const toggleSubscription = async (sensorId: string, isSubscribed: boolean) => {
    try {
      const endpoint = isSubscribed ? 'unsubscribe' : 'subscribe';
      const response = await fetch(`/api/sensors/${sensorId}/${endpoint}`, {
        method: 'POST'
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      alert('Failed to update subscription');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">IoT Infrastructure Admin</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={createDefaultStructures}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Default Structures
        </button>
        <button
          onClick={() => setShowCreateStructure(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Structure
        </button>
        <button
          onClick={() => setShowCreateSensor(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Sensor
        </button>
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-sm text-gray-600">Total Sensors</div>
          <div className="text-2xl font-bold">{sensors.length}</div>
        </div>
      </div>

      {/* Structures */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Infrastructure Structures ({structures.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Sensors</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {structures.map(structure => (
                <tr key={structure.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{structure.name}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {structure.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">{structure.location}</td>
                  <td className="px-4 py-2">{structure._count.sensors}</td>
                  <td className="px-4 py-2">
                    <a 
                      href={`/admin/structures/${structure.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Health
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensors */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">IoT Sensors ({sensors.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Sensor Code</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Structure</th>
                <th className="px-4 py-2 text-left">Topic</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map(sensor => (
                <tr key={sensor.id} className="border-t">
                  <td className="px-4 py-2 font-mono font-medium">{sensor.sensorCode}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                      {sensor.sensorType}
                    </span>
                  </td>
                  <td className="px-4 py-2">{sensor.structure.name}</td>
                  <td className="px-4 py-2 font-mono text-sm">{sensor.topicName}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        sensor.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sensor.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        sensor.isSubscribed 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sensor.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSubscription(sensor.id, sensor.isSubscribed)}
                        className={`px-3 py-1 rounded text-sm ${
                          sensor.isSubscribed
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {sensor.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                      </button>
                      <a 
                        href={`/admin/sensors/${sensor.id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        View Data
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Structure Modal */}
      {showCreateStructure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create Structure</h3>
            <form onSubmit={createStructure}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={structureForm.name}
                  onChange={e => setStructureForm({...structureForm, name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Type</label>
                <select
                  value={structureForm.type}
                  onChange={e => setStructureForm({...structureForm, type: e.target.value as StructureType})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="ROAD">Road</option>
                  <option value="BRIDGE">Bridge</option>
                  <option value="PIPELINE">Pipeline</option>
                  <option value="SUBSTATION">Substation</option>
                  <option value="BUILDING">Building</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Location</label>
                <input
                  type="text"
                  value={structureForm.location}
                  onChange={e => setStructureForm({...structureForm, location: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateStructure(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Sensor Modal */}
      {showCreateSensor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create Sensor</h3>
            <form onSubmit={createSensor}>
              <div className="mb-4">
                <label className="block mb-2">Sensor Code</label>
                <input
                  type="text"
                  value={sensorForm.sensorCode}
                  onChange={e => setSensorForm({...sensorForm, sensorCode: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., SENSOR_001"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Sensor Type</label>
                <select
                  value={sensorForm.sensorType}
                  onChange={e => {
                    const type = e.target.value as SensorType;
                    setSensorForm({
                      ...sensorForm, 
                      sensorType: type,
                      topicName: sensorTopicMapping[type] || 'iot.telemetry.other'
                    });
                  }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="WATER_METER">Water Meter</option>
                  <option value="PRESSURE_SENSOR">Pressure Sensor</option>
                  <option value="ENERGY_METER">Energy Meter</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Structure</label>
                <select
                  value={sensorForm.structureId}
                  onChange={e => setSensorForm({...sensorForm, structureId: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Structure</option>
                  {structures.map(structure => (
                    <option key={structure.id} value={structure.id}>
                      {structure.name} ({structure.type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Topic Name</label>
                <input
                  type="text"
                  value={sensorForm.topicName}
                  onChange={e => setSensorForm({...sensorForm, topicName: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateSensor(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}