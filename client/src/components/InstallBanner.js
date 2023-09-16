import React, { useState, useEffect } from 'react';

function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowBanner(false);
    }
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User declined the install prompt');
        }
        setDeferredPrompt(null);
        setShowBanner(false);
      });
    }
  };

  return showBanner ? (
    <div className="install-banner">
      <p>Install this app on your device for an enhanced experience.</p>
      <button onClick={handleInstallClick}>Install</button>
    </div>
  ) : null;
}

export default InstallBanner;
