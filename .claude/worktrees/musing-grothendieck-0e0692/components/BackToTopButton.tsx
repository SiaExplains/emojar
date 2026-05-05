'use client';
const BackToTopButton = () => {
  return (
    <div
      className="fixed bottom-8 text-xl right-8 border border-gray-300 bg-white rounded-full p-4 shadow-md hover:cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }}
    >
      <button className="w-[28px] h-[28px]">⬆️</button>
    </div>
  );
};
export default BackToTopButton;
