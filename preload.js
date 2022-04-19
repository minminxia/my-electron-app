window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    // 使用了nodejs的process.versions[node]
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})