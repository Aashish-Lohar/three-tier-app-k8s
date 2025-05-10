import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { TodoProvider } from './context/TodoContext';

function App() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-emerald-50 flex flex-col items-center py-8 px-4">
        <header className="w-full max-w-lg mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2 tracking-tight">taskify</h1>
          <p className="text-gray-600">Your simple, beautiful todo app</p>
        </header>
        
        <main className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
          <div className="p-6 border-b border-gray-100">
            <TodoForm />
          </div>
          
          <TodoList />
          
          <TodoFooter />
        </main>
        
        <footer className="mt-8 text-center text-gray-500 text-sm flex items-center space-x-1">
          <Info size={14} />
          <span>React frontend + FastAPI backend</span>
        </footer>
      </div>
    </TodoProvider>
  );
}

function TodoForm() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState('');
  const { addTodo, loading } = React.useContext(TodoContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await addTodo(inputValue.trim());
      setInputValue('');
      
      // Refocus the input after submission
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <ChevronDown size={18} className="transition-transform duration-200" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="What needs to be done?"
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 text-gray-800"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
        />
      </div>
      <button 
        type="submit"
        disabled={!inputValue.trim() || loading}
        className={`ml-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          !inputValue.trim() || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-500 text-white hover:bg-indigo-600'
        }`}
      >
        Add
      </button>
    </form>
  );
}

// Import for TodoContext
import { TodoContext } from './context/TodoContext';

export default App;