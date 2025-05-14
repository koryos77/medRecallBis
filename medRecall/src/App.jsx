import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [medicaments, setMedicaments] = useState([]);
  const [name, setName] = useState("");
  const [hour, setHour] = useState("");
  const [phone, setPhone] = useState("");


  const fetchReminders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/reminders');
      setMedicaments(res.data);
    } catch (err) {
      console.error('Error fetching reminders', err);
    }
  };

  const addMed = async () => {
    if (name && hour) {
      try {
        await axios.post('http://127.0.0.1:5000/api/reminders', { name, hour, phone});
        setName('');
        setHour('');
        setPhone('');
        fetchReminders();
      } catch (err) {
        console.error('Error adding reminder.', err);
      }
    }
  };

  const deleteReminder = async (index) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/reminders/${index}`);
      setMedicaments(medicaments.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting reminder.", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <img src="src/assets/logo.png" alt="Logo" className="w-24 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">MedRecall</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="name of the med"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          />
          <input
            type="time"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          />
          <input
            type="tel"
            placeholder="Number (ex: +33612345678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          />
          <button
            onClick={addMed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
          >
            Accept
          </button>
        </div>

        {medicaments.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Reminders :</h2>
            <ul className="space-y-2">
              {medicaments.map((m, i) => (
                <li key={i} className="bg-blue-100 rounded-xl px-4 py-2 flex justify-between">
                  <span>{m.name}</span>
                  <span>{m.hour}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {medicaments.map((m, i) => (
                <li key={i} className="bg-blue-100 rounded-xl px-4 py-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{m.name}</span> — <span>{m.hour}</span>
                  </div>
                  <button
                    onClick={() => deleteReminder(i)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
