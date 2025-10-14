'use client';
const BackToTopButton = () => {
  return (
    <div
      className="fixed bottom-8 text-xl right-8 border border-gray-300 bg-white rounded-full p-4 shadow-lg hover:cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-200"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }}
    >
      <button>⬆️</button>
    </div>
  );
};
export default BackToTopButton;
