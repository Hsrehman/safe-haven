"useClient";
function App() {
    const [reviews, setReviews] = React.useState([]);
    const [polls, setPolls] = React.useState([]);
    const [userFeedback, setUserFeedback] = React.useState('');
    const [selectedPoll, setSelectedPoll] = React.useState(null);
  
    // Simulate initial data
    React.useEffect(() => {
      setReviews([
        { id: 1, text: "Great service, very helpful staff!", rating: 5 },
        { id: 2, text: "Quick and efficient process", rating: 4 }
      ]);
  
      setPolls([
        { id: 1, question: "How satisfied are you with our service?", options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
        { id: 2, question: "What time of day works best for you?", options: ["Morning", "Afternoon", "Evening"] }
      ]);
    }, []);
  
    const handleFeedbackSubmit = () => {
      if (userFeedback.trim()) {
        setReviews([...reviews, { id: reviews.length + 1, text: userFeedback, rating: 5 }]);
        setUserFeedback('');
        alert('Thank you for your feedback!');
      }
    };
  
    const handlePollSubmit = () => {
      if (selectedPoll) {
        alert('Thank you for participating in the poll!');
        setSelectedPoll(null);
      }
    };
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Foodbank User Dashboard</h1>
  
        {/* Reviews Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Community Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-3">
                <p className="text-gray-700">{review.text}</p>
                <div className="text-yellow-500 mt-1">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Feedback Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Share Your Experience</h2>
          <textarea
            className="w-full p-3 border rounded-lg mb-4 h-32"
            placeholder="Share your feedback about our foodbank..."
            value={userFeedback}
            onChange={(e) => setUserFeedback(e.target.value)}
          />
          <button
            onClick={handleFeedbackSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit Feedback
          </button>
        </div>
  
        {/* Polls Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Polls</h2>
          {polls.map((poll) => (
            <div key={poll.id} className="mb-6 last:mb-0">
              <p className="font-medium mb-3">{poll.question}</p>
              <div className="space-y-2">
                {poll.options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`${poll.id}-${index}`}
                      name={`poll-${poll.id}`}
                      className="mr-2"
                      onChange={() => setSelectedPoll({ pollId: poll.id, option })}
                    />
                    <label htmlFor={`${poll.id}-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handlePollSubmit}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Submit Poll Response
          </button>
        </div>
      </div>
    );
  }