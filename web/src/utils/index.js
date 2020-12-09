let clipboardInputElement = null;

function init() {
  console.log(1);
  clipboardInputElement = document.createElement('textarea');
  clipboardInputElement.setAttribute('readonly', '');
  clipboardInputElement.style.position = 'absolute';
  clipboardInputElement.style.left = '-9999px';
  document.body.appendChild(clipboardInputElement);
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  if (!clipboardInputElement) init();
  try {
    clipboardInputElement.value = text;
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    clipboardInputElement.select();
    document.execCommand('copy');
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  } catch (error) {
    console.log(error);
  }
}
