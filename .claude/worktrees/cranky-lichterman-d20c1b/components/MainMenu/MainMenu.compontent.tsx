import DesktopMainMenu from './DesktopMainMenu';
import MobileMainMenu from './MobileMainMenu.component';

const MainMenu = () => {
  return (
    <nav aria-label="Main" className="w-full">
      {/* Mobile (<= md) */}
      <div className="md:hidden">
        <MobileMainMenu />
      </div>

      {/* Desktop (>= md) */}
      <div className="hidden md:block">
        <DesktopMainMenu />
      </div>
    </nav>
  );
};

export default MainMenu;
