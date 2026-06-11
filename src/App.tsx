export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">📚 Online Bookstore Project</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl">
        This is a vanilla JavaScript bookstore project.
        The main application is built using static HTML, CSS, and JS files.
      </p>
      
      <div className="flex gap-4">
        <a 
          href="/index.html" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Open Bookstore
        </a>
        <a 
          href="/admin.html" 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Open Admin Portal
        </a>
      </div>

      <div className="mt-12 text-left bg-white p-6 rounded-xl shadow-md max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-3">Project Files:</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li><strong>index.html</strong>: The main shop interface</li>
          <li><strong>style.css</strong>: All the styling for the app</li>
          <li><strong>script.js</strong>: Logic for the shop and basket</li>
          <li><strong>admin.html</strong>: The portal for managing books</li>
          <li><strong>admin.js</strong>: Logic for stats and adding books</li>
          <li><strong>README.md</strong>: Detailed beginner guide</li>
        </ul>
      </div>
    </div>
  );
}
