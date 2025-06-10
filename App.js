import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const defaultTheme = {
  background: '#ffffff',
  text: '#000000',
  accent: '#3b82f6',
  font: 'sans-serif',
};

export default function EmojiGifSaverApp() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('emoji');
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('emojiGifItems')) || [];
    const savedTheme = JSON.parse(localStorage.getItem('emojiGifTheme')) || defaultTheme;
    setItems(savedItems);
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('emojiGifItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('emojiGifTheme', JSON.stringify(theme));
  }, [theme]);

  const addItem = () => {
    if (!input || !name) return;
    setItems([{ id: Date.now(), value: input, type, name }, ...items]);
    setInput('');
    setName('');
  };

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    alert('Copied to clipboard!');
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto" style={{ backgroundColor: theme.background, color: theme.text, fontFamily: theme.font }}>
      <h1 className="text-2xl font-bold mb-4">Emoji & GIF Saver</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Name/label"
          className="border px-2 py-1 flex-grow"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder={type === 'emoji' ? 'Enter emoji (e.g. :sparkles:)' : 'Enter GIF URL'}
          className="border px-2 py-1 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border px-2">
          <option value="emoji">Emoji</option>
          <option value="gif">GIF</option>
        </select>
        <button onClick={addItem} className="px-3 py-1" style={{ backgroundColor: theme.accent, color: '#fff' }}>Add</button>
      </div>

      <input
        type="text"
        placeholder="Search saved items..."
        className="border px-2 py-1 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Theme Settings</h2>
        <div className="flex flex-col gap-2">
          <input type="color" value={theme.background} onChange={e => setTheme({ ...theme, background: e.target.value })} title="Background" />
          <input type="color" value={theme.text} onChange={e => setTheme({ ...theme, text: e.target.value })} title="Text" />
          <input type="color" value={theme.accent} onChange={e => setTheme({ ...theme, accent: e.target.value })} title="Accent Color" />
          <select value={theme.font} onChange={e => setTheme({ ...theme, font: e.target.value })}>
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 gap-4">
              {filteredItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border p-3 rounded shadow-sm cursor-pointer"
                      style={{ backgroundColor: '#f9f9f9' }}
                      onClick={() => copyToClipboard(item.value)}
                    >
                      {item.type === 'emoji' ? (
                        <p className="text-lg mb-2">{item.value}</p>
                      ) : (
                        <img src={item.value} alt="gif" className="w-full h-auto max-h-40 object-cover mb-2" />
                      )}
                      <p className="text-sm text-gray-700">{item.name}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
