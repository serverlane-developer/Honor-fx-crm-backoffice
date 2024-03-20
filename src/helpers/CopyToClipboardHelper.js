function copyTextToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  }
  // text area method
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  // make the textarea out of viewport
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  return new Promise((res, rej) => {
    // here the magic happens
    const copied = document.execCommand("copy");
    if (copied) res();
    else rej();
    textArea.remove();
  });
}

async function copyBlobToClipboard(imgBlob) {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [imgBlob.type]: imgBlob,
      }),
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { copyTextToClipboard, copyBlobToClipboard };
