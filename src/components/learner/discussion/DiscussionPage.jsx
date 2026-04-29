import { FaComments, FaUserCircle, FaThumbsUp, FaReply } from 'react-icons/fa';

export default function DiscussionPage() {
  const discussions = [
    { id: 1, user: "Alice Johnson", message: "Anyone having issues with useEffect cleanup?", time: "2 hours ago", likes: 5, replies: 3 },
    { id: 2, user: "Bob Smith", message: "Great explanation on the useContext hook!", time: "5 hours ago", likes: 12, replies: 2 },
    { id: 3, user: "Carol Davis", message: "When is the next assignment due?", time: "1 day ago", likes: 3, replies: 1 },
  ];

  return (
    <div className="w-full p-6 bg-gray-50 h-screen overflow-y-auto">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <FaComments className="text-green-600 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-800">Discussions</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Course: Advanced React Development</p>
        </div>

        {/* New Post Input */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-3">
            <FaUserCircle className="text-gray-400 text-4xl" />
            <input
              type="text"
              placeholder="Start a new discussion..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
              Post
            </button>
          </div>
        </div>

        {/* Discussion List */}
        <div className="space-y-4">
          {discussions.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-3">
                <FaUserCircle className="text-gray-400 text-4xl" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-gray-800">{post.user}</span>
                      <span className="text-xs text-gray-400 ml-2">{post.time}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{post.message}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
                      <FaThumbsUp /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
                      <FaReply /> {post.replies} replies
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}