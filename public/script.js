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

function paginate(selectedPage, totalPages) {
  const pages = []
  let oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage += 1) {
    const firstAndLastPage = currentPage === 1 || currentPage === totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...')
      }
      if (oldPage && currentPage - oldPage === 2) {
        pages.push(oldPage + 1)
      }
      pages.push(currentPage)

      oldPage = currentPage
    }
  }
  return pages
}

function activePaginate() {
  const pagination = document.querySelector('[data-pagination]')

  if (pagination) {
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ''

    pages.forEach((value) => {
      if (String(value).includes('...')) {
        elements += `<li><span>${value}</span></li>`
      } else {
        elements += `<li><a href="?page=${value}">${value}</a></li>`
      }
    })

    pagination.innerHTML = elements
  }
}

function removeInputEdit() {
  const btnRemove = document.querySelectorAll('[data-btn="remove"]')

  function removeInput(event) {
    event.target.parentElement.remove()
  }

  if (btnRemove) {
    btnRemove.forEach((btn) => {
      btn.addEventListener('click', removeInput)
    })
  }
}

recipeInfoAccordion()
AddDynamicField()
activeLinkMenu()
activePaginate()
removeInputEdit()
