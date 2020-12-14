import * as React from 'react';

function IndexPage() {
  return <div className="index-page">
    <div className="index-page-left">
      <h2>所有项目</h2>
      <div className="index-page-projects">
        <div className="index-page-project">
          <div className="index-page-project-head">
            <div className="index-page-project-img">
              <img src="" alt=""/>
            </div>
            <div className="index-page-project-info">
              <b>昆仑项目图标</b>
              <p>
                Author
              </p>
            </div>
          </div>
          <div className="index-page-project-count">

          </div>
        </div>
      </div>
    </div>
    <div className="index-page-right">
      <h2>动态</h2>
      <div className="index-page-activites">

      </div>
    </div>
  </div>
}

export default IndexPage;