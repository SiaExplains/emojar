import DesktopMainMenu from './DesktopMainMenu';
import MobileMainMenu from './MobileMainMenu.component';

const MainMenu = () => {
  return (
    <nav aria-label="Main" className="w-full">
      {/* Phones and tablets (< lg): five entries plus search don't fit */}
      <div className="lg:hidden">
        <MobileMainMenu />
      </div>

      {/* Desktop (>= lg) */}
      <div className="hidden lg:block">
        <DesktopMainMenu />
      </div>
    </nav>
  );
};

export default MainMenu;
