export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Trotro Route Finder. All rights reserved.</p>
                <div className="mt-4 flex justify-center space-x-6">
                    <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
                    <a href="/admin" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Staff Portal</a>
                </div>
            </div>
        </footer>
    );
}
