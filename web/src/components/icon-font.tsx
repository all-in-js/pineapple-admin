import * as React from 'react';
import classnames from 'classnames';

export default (props: any) => {
  const { color, size, name, className } = props;
  const iconClas = classnames('iconfont', name, className);
  const iconStyle: {
    color?: string;
    fontSize?: string;
  } = {};
  if (color) {
    iconStyle.color = color;
  }
  if (size) {
    iconStyle.fontSize = size;
  }
  return (
    <i
      style={ iconStyle }
      className={ iconClas }>
    </i>
  );
}