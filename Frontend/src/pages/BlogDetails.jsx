import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Clock,
  Eye,
  User,
  Tag,
  Calendar,
  Mail,
  Bell,
  Share2,
  ChevronUp,
} from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showProgress, setShowProgress] = useState(0);
  const [showFAB, setShowFAB] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setShowProgress(progress);
      setShowFAB(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://internship-resume.onrender.com/api/blogs/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        if (response.data.success) {
          setBlog(response.data.blog);
        } else {
          throw new Error("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.response?.data?.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, token]);

  const handleLike = () => {
    setLiked(!liked);
    setBlog((prev) => ({
      ...prev,
      likes: liked ? (prev.likes || 0) - 1 : (prev.likes || 0) + 1,
    }));
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: `Check out this article: ${blog?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recent";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
          <div className="h-8 w-full bg-gray-200 rounded mb-3"></div>
          <div className="h-8 w-5/6 bg-gray-200 rounded mb-6"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Blog not found
          </h2>
          <p className="text-gray-600 mb-6 max-w-xs mx-auto">
            {error ||
              "The article you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Global styles to prevent horizontal scroll */
        * {
          max-width: 100%;
          box-sizing: border-box;
        }
        
        html, body {
          overflow-x: hidden !important;
          width: 100% !important;
          position: relative !important;
        }
        
        /* Article content styles */
        .blog-content {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden !important;
        }
        
        .blog-content * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Images */
        .blog-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }
        
        /* Tables - make scrollable */
        .blog-content table {
          display: block !important;
          width: 100% !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
        
        /* Code blocks */
        .blog-content pre {
          max-width: 100% !important;
          overflow-x: auto !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          background: #1f2937;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .blog-content code {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }
        
        /* Iframes and videos */
        .blog-content iframe,
        .blog-content video,
        .blog-content embed {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
        }
        
        /* Blockquotes */
        .blog-content blockquote {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* All text elements */
        .blog-content p,
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6,
        .blog-content li,
        .blog-content span,
        .blog-content a {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      `}</style>

      <div className="min-h-screen bg-white" style={{ overflowX: "hidden" }}>
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
          <div
            className="h-full bg-blue-600 transition-all duration-100"
            style={{ width: `${showProgress}%` }}
          ></div>
        </div>

        {/* Navigation Bar */}
        <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="w-full px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  liked
                    ? "bg-red-50 text-red-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                <span className="text-sm font-medium">
                  {blog.likes?.length || blog.likes || 0}
                </span>
              </button>

              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  saved ? "text-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="border-b border-gray-100">
          <div className="w-full px-4 py-6 md:max-w-3xl md:mx-auto">
            {/* Category/Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.category && (
                <Link
                  to={`/category/${blog.category}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  <Tag size={12} />
                  {blog.category}
                </Link>
              )}
              {blog.tags?.slice(0, 3).map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/tag/${tag}`}
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight break-words">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-b border-gray-100">
              <div className="flex items-center gap-3">
                {blog.author?.profilePic ? (
                  <img
                    src={blog.author.profilePic}
                    alt={blog.author.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
                    {blog.author?.name?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {blog.author?.name || "Anonymous Author"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {getReadingTime(blog.content)} min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {blog.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                <User size={14} />
                Follow Author
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="w-full px-4 py-6 md:max-w-4xl md:mx-auto">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full object-cover rounded-xl shadow-lg"
              style={{ maxHeight: "500px" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/1200x600?text=No+Image";
                e.target.onerror = null;
              }}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="w-full px-4 py-6 md:max-w-3xl md:mx-auto">
          <article className="blog-content w-full">
            <div
              className="
                text-gray-800
                text-base sm:text-lg
                leading-relaxed
                w-full
                
                /* Headings */
                [&>h1]:text-2xl [&>h1]:sm:text-3xl [&>h1]:md:text-4xl [&>h1]:font-bold 
                [&>h1]:text-gray-900 [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:leading-tight [&>h1]:break-words
                
                [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold 
                [&>h2]:text-gray-900 [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:leading-tight [&>h2]:break-words
                
                [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:font-bold 
                [&>h3]:text-gray-900 [&>h3]:mt-5 [&>h3]:mb-2.5 [&>h3]:break-words
                
                [&>h4]:text-base [&>h4]:sm:text-lg [&>h4]:md:text-xl [&>h4]:font-semibold 
                [&>h4]:text-gray-900 [&>h4]:mt-4 [&>h4]:mb-2 [&>h4]:break-words
                
                /* Paragraphs */
                [&>p]:text-gray-800 [&>p]:mb-5 [&>p]:leading-relaxed [&>p]:break-words
                
                /* Links */
                [&>a]:text-blue-600 [&>a]:underline [&>a]:break-words
                
                /* Lists */
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:sm:pl-6 [&>ul]:my-5 [&>ul]:space-y-2
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:sm:pl-6 [&>ol]:my-5 [&>ol]:space-y-2
                [&>li]:text-gray-800 [&>li]:mb-1 [&>li]:break-words
                
                /* Blockquotes */
                [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 [&>blockquote]:pl-4 
                [&>blockquote]:sm:pl-5 [&>blockquote]:italic [&>blockquote]:text-gray-600 
                [&>blockquote]:my-6 [&>blockquote]:text-sm [&>blockquote]:sm:text-base
                [&>blockquote]:break-words
                
                /* Images */
                [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:shadow-md 
                [&>img]:my-6
                
                /* Horizontal Rule */
                [&>hr]:my-8 [&>hr]:border-gray-200
              "
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/tag/${tag}`}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Section */}
          <div className="mt-8 flex flex-wrap items-center gap-3 py-6 border-t border-b border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-200 ${
                liked
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              <span className="font-medium text-sm sm:text-base">
                {blog.likes?.length || blog.likes || 0} Likes
              </span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-200 ${
                saved
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              <span className="text-sm sm:text-base">
                {saved ? "Saved" : "Save"}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <Share2 size={18} />
              <span className="text-sm sm:text-base">Share</span>
            </button>
          </div>

          {/* Author Bio */}
          {blog.author && (
            <div className="mt-8 p-5 bg-gray-50 rounded-xl">
              <div className="flex flex-col sm:flex-row gap-4">
                {blog.author.profilePic ? (
                  <img
                    src={blog.author.profilePic}
                    alt={blog.author.name}
                    className="h-14 w-14 rounded-full object-cover mx-auto sm:mx-0"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-semibold mx-auto sm:mx-0">
                    {blog.author.name?.charAt(0) || "A"}
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {blog.author.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 break-words">
                    {blog.author.bio ||
                      "Passionate writer sharing insights and stories about technology, life, and everything in between."}
                  </p>
                  <div className="flex gap-3 justify-center sm:justify-start">
                    <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                      <Mail size={14} />
                      Subscribe
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                      <User size={14} />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscribe Section */}
          <div className="mt-8 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 text-center">
              <Bell className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Never miss a story
              </h3>
              <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto break-words">
                Get the best stories from{" "}
                <span className="font-semibold text-blue-600">
                  {blog.author?.name || "this writer"}
                </span>{" "}
                delivered straight to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSubscribe}
                  className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    subscribed
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {subscribed ? "Subscribed! ✓" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div
          className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
            showFAB
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-3 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:bg-blue-700"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
