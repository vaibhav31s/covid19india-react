import React from 'react';

if (import.meta.env.MODE === 'development') {
  import('@welldone-software/why-did-you-render').then(
    ({default: whyDidYouRender}) => {
      whyDidYouRender(React, {
        trackAllPureComponents: true,
        // logOwnerReasons: true,
        // logOnDifferentValues: true,
      });
    }
  );
}
