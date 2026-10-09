'use client';

const BackToTopButton = () => (
  <button
    type="button"
    aria-label="Back to top"
    onClick={() => {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }}
    className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white text-xl shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
  >
    <span aria-hidden>⬆️</span>
  </button>
);

export default BackToTopButton;
