import React from 'react';
import ReactDom from 'react-dom';

export default function AdminModalOverlay({ children, isOpen, toggleModal }) {
  const [overlay] = React.useState(document.createElement('div'));

  React.useEffect(() => {
    if (isOpen) {
      const body = document.getElementsByTagName('body')[0];
      overlay.className =
        'bg-black bg-opacity-20 fixed top-0 left-0 right-0 bottom-0 z-40 flex justify-center items-center overflow-y-scroll';
      overlay.onclick = (e) => {
        if (e.currentTarget === e.target) toggleModal();
      };
      body.appendChild(overlay);
    } else {
      overlay.remove();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;
  return ReactDom.createPortal(children, overlay);
}
