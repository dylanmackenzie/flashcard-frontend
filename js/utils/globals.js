let globals = {
  $: document.querySelector.bind(document),
  $$: document.querySelectorAll.bind(document)
}

export default globals
