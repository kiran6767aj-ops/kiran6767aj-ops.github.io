(() => {
  const config = window.LOOP_ADS || {};
  const publisherId = typeof config.publisherId === 'string' ? config.publisherId : '';
  const slots = config.slots || {};
  const validPublisher = /^ca-pub-\d+$/.test(publisherId);
  let scriptLoaded = false;

  function showPlaceholder(placement) {
    const label = document.createElement('strong');
    label.textContent = 'Ad space';
    const detail = document.createElement('span');
    detail.textContent = 'Connect an approved AdSense account to show ads here.';
    placement.replaceChildren(label, detail);
  }

  window.initializeLoopAds = function(root = document) {
    const placements = root.matches?.('[data-ad-slot]')
      ? [root]
      : [...root.querySelectorAll('[data-ad-slot]')];

    placements.forEach(placement => {
      if (placement.dataset.adInitialized === 'true') return;
      const slotId = String(slots[placement.dataset.adSlot] || '');
      if (!validPublisher || !/^\d+$/.test(slotId)) {
        showPlaceholder(placement);
        return;
      }
      placement.dataset.adInitialized = 'true';
      const renderAd = () => {
        const ad = document.createElement('ins');
        ad.className = 'adsbygoogle';
        ad.style.display = 'block';
        ad.dataset.adClient = publisherId;
        ad.dataset.adSlot = slotId;
        ad.dataset.adFormat = 'auto';
        ad.dataset.fullWidthResponsive = 'true';
        placement.replaceChildren(ad);
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
        catch (error) { console.error('AdSense unit could not be initialized.', error); }
      };

      if (window.adsbygoogle) {
        renderAd();
      } else if (!scriptLoaded) {
        scriptLoaded = true;
        const adsenseScript = document.createElement('script');
        adsenseScript.async = true;
        adsenseScript.crossOrigin = 'anonymous';
        adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
        adsenseScript.onload = () => {
          document.querySelectorAll('[data-ad-initialized="true"]').forEach(target => {
            const id = String(slots[target.dataset.adSlot] || '');
            if (/^\d+$/.test(id) && !target.querySelector('ins.adsbygoogle')) {
              const ad = document.createElement('ins');
              ad.className = 'adsbygoogle';
              ad.style.display = 'block';
              ad.dataset.adClient = publisherId;
              ad.dataset.adSlot = id;
              ad.dataset.adFormat = 'auto';
              ad.dataset.fullWidthResponsive = 'true';
              target.replaceChildren(ad);
              try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
              catch (error) { console.error('AdSense unit could not be initialized.', error); }
            }
          });
        };
        document.head.append(adsenseScript);
      }
    });
  };

  window.initializeLoopAds();
})();
