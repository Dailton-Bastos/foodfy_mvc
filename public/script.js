function recipeInfoAccordion() {
  const btnAccordionList = document.querySelectorAll('[data-btn="accordion"]')

  const activeClass = 'active'

  function activeAccordion() {
    this.classList.toggle(activeClass)
    this.nextElementSibling.classList.toggle(activeClass)
  }

  if (btnAccordionList.length) {
    btnAccordionList[0].classList.add(activeClass)
    btnAccordionList[0].nextElementSibling.classList.add(activeClass)

    btnAccordionList.forEach((item) => {
      item.addEventListener('click', activeAccordion)
    })
  }
}

function cloneChild(parent) {
  const inputChild = parent.querySelectorAll('[data-child]')
  const newChild = inputChild[inputChild.length - 1].cloneNode(true)

  if (newChild.children[0].value === '') return false

  newChild.children[0].value = ''

  function handleRemoveChild(event) {
    event.currentTarget.parentElement.remove()
  }

  const removeCloneChild = (child) => {
    const btnRemove = child.querySelector('[data-btn="remove"]')

    btnRemove.addEventListener('click', handleRemoveChild)
  }

  removeCloneChild(newChild)

  return parent.appendChild(newChild)
}

function addCloneChild(event) {
  event.preventDefault()

  const parent = event.target.previousElementSibling

  cloneChild(parent)
}

function AddDynamicField() {
  const btnAddIngred = document.querySelector('[data-btn="ingred"]')
  const btnAddPrep = document.querySelector('[data-btn="prep"]')

  if (btnAddIngred) {
    btnAddIngred.addEventListener('click', addCloneChild)
  }

  if (btnAddPrep) {
    btnAddPrep.addEventListener('click', addCloneChild)
  }
}

function activeLinkMenu() {
  const currentPage = this.location.pathname
  const menuLinks = document.querySelectorAll('[data-menu="links"] a')

  if (menuLinks) {
    menuLinks.forEach((item) => {
      if (currentPage.includes(item.getAttribute('href'))) {
        item.style.opacity = 1
        item.style.fontWeight = 'bold'
        item.style.borderBottom = '1px solid'
      }
    })
  }
}

recipeInfoAccordion()
AddDynamicField()
activeLinkMenu()
