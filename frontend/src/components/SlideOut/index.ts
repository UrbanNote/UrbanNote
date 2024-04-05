import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import SlideOutComponent from './SlideOut';

type SlideOutWithSubComponents = typeof SlideOutComponent & {
  Body: typeof Body;
  Footer: typeof Footer;
  Header: typeof Header;
};

const SlideOut = SlideOutComponent as SlideOutWithSubComponents;

SlideOut.Body = Body;
SlideOut.Footer = Footer;
SlideOut.Header = Header;

export default SlideOut;
