import * as React from 'react';

interface DataObj {
  [key: string]: any;
}

interface SvgIconsOption {
  svgIcons?: DataObj;
  classPrefix?: string;
  isStroke?: boolean;
  defaultWidth?: string;
  defaultHeight?: string;
}

export default class SvgIcons {
  constructor(options: SvgIconsOption) {
    if (!options) options = {};

    /**
     * 注册所有的图标
     * svgIcons: {
     *  icon: {
     *      name: "icon",
     *      data: "<g><g>,
     *      viewBox: "0 0 78 78",
     *      width: 78,
     *      height: 78
     *   }
     * }
     */
    const ___ = {}; // this value will be replaced with loader
    let _svgIcons = ___;

    if (options.svgIcons) {
      // local svg data
      _svgIcons = {
        ..._svgIcons,
        ...options.svgIcons
      };
    }

    return (props: any): any => {
      return (
        <svg>
          svg
        </svg>
      );
    };
  }
}
