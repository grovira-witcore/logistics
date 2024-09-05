// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';

const Tabs = function ({ tabs }) {
  const [activeTabIndex, setActiveTabIndex] = React.useState(-1);

  React.useEffect(() => {
    setActiveTabIndex(tabs.findIndex(tabX => !tabX.hidden));
  }, []);

  const handleClickTab = function (e, tabIndex) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setActiveTabIndex(tabIndex);
  }

  if (tabs.length > 0) {
    return (
      <div>
        <div className="wit-tabs d-flex">
          {tabs.map((tab, index) =>
            !tab.hidden ? (
              <div key={'tab-' + index}>
                <div
                  className={'wit-tab ' + (activeTabIndex === index ? 'wit-tab-active' : 'cursor-pointer')}
                  onClick={(e) => handleClickTab(e, index)}
                 
                >
                  {tab.icon ?
                    <div className="wit-tab-icon d-flex justify-content-center">
                      {React.createElement(tab.icon)}
                    </div> :
                    null
                  }
                  {tab.label ?
                    <div className="pt-2">
                      {tab.label}
                    </div> :
                    <div>
                      {'Tab'}
                    </div>
                  }
                </div>
              </div>
            ) : null
          )}
          <div className="flex-grow-1 border-bottom" />
        </div>
        <div>
          {tabs.map((tab, index) => 
            !tab.hidden ? (
              <div key={'tab-' + index} className={activeTabIndex === index ? 'd-block' : 'd-none'}>
                {React.createElement(tab.component, tab.arguments)}
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  }
  else {
    return (
      <div>
        <div className="wit-tabs d-flex">
          <div>
            {'Tab'}
          </div>
          <div className="flex-grow-1 border-bottom" />
        </div>
      </div>
   );
 }
}

export default Tabs;