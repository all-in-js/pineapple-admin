import * as React from 'react';

function IndexPage() {
  return <div className="index-page">
    <div className="left">
      <h2>所有项目</h2>
      <div className="projects">
        <div className="project">
          <div className="project-head">
            <div className="project-img">
              <img src="" alt=""/>
            </div>
            <div className="project-info">
              <b>昆仑项目图标</b>
              <p>
                Author
              </p>
            </div>
          </div>
          <div className="project-count">
            <div className="count-block">
              <p>图标数</p>
              <p><b>123</b></p>
            </div>
            <div className="count-block">
              <p>成员数</p>
              <p><b>23</b></p>
            </div>
          </div>
          <div className="project-footer">
            <span>
              <i className="iconfont icon-zan"></i>
              123
            </span>
            <i className="iconfont icon-moreif"></i>
          </div>
        </div>
      </div>
    </div>
    <div className="right">
      <h2>动态</h2>
      <div className="activites">

      </div>
    </div>
  </div>
}

export default IndexPage;