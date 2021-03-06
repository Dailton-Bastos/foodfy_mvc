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
    const { filter } = pagination.dataset
    const pages = paginate(page, total)

    let elements = ''

    pages.forEach((value) => {
      if (String(value).includes('...')) {
        elements += `<li><span>${value}</span></li>`
      } else if (filter) {
        elements += `
          <li>
            <a href="?page=${value}&filter=${filter}">${value}</a>
          </li>`
      } else {
        elements += `<li><a href="?page=${value}">${value}</a></li>`
      }
    })

    pagination.innerHTML = elements
  }
}

const Menu = {
  currentPage: this.location.pathname,
  links: document.querySelectorAll('[data-menu="links"] a'),
  activeLink() {
    Menu.links.forEach((link) => {
      if (this.currentPage.includes(link.getAttribute('href'))) {
        link.style.opacity = 1
        link.style.fontWeight = 'bold'
        link.style.borderBottom = '1px solid'
      }
    })
  },
}

const Accordion = {
  status: 'active',
  title(event) {
    event.target.classList.toggle(Accordion.status)
    event.target.nextElementSibling.classList.toggle(Accordion.status)
  },
}

const AddNewInput = {
  containerInput: '',
  addInput(event) {
    event.preventDefault()
    AddNewInput.containerInput = event.target.previousElementSibling
    const children = AddNewInput.containerInput.querySelectorAll('[data-child]')
    const newChild = children[children.length - 1].cloneNode(true)

    if (newChild.children[0].value === '') return false

    newChild.children[0].value = ''

    return AddNewInput.containerInput.appendChild(newChild)
  },
  removeInput(event) {
    return event.target.parentNode.remove()
  },
}

const PhotosUpload = {
  input: '',
  preview: document.querySelector('[data-preview="image"]'),
  previewChildren: [],
  files: [],
  uploadLimit: 5,
  handleFileInput(event) {
    const { files: fileList } = event.target

    PhotosUpload.input = event.target

    if (PhotosUpload.hasLimitPhotos(event)) return

    Array.from(fileList).forEach((file) => {
      PhotosUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const container = PhotosUpload.getContainerPhoto(image)

        PhotosUpload.preview.appendChild(container)
        PhotosUpload.previewChildren.push(container)
      }

      return reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getDataTransfer()
  },

  handleFileAvatar(event) {
    const { files } = event.target
    PhotosUpload.input = event.target

    const existsAvatar = document.querySelector('[data-image="avatar"]')

    const file = files[0]

    if (existsAvatar && file) {
      const image = existsAvatar.querySelector('img')
      image.src = URL.createObjectURL(file)
    }

    if (existsAvatar && !file) existsAvatar.remove()

    if (file && !existsAvatar) {
      const avatar = new Image()
      avatar.src = URL.createObjectURL(file)
      const container = PhotosUpload.getContainerPhoto(avatar)
      container.setAttribute('data-image', 'avatar')
      PhotosUpload.preview.appendChild(container)
    }
  },

  hasLimitPhotos(event) {
    const { uploadLimit, input, preview } = PhotosUpload

    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      PhotosUpload.input.files = PhotosUpload.getAllFiles()
      event.preventDefault()
      return true
    }

    const childrenPreview = []

    preview.childNodes.forEach((child) => {
      if (child.classList && child.classList.value === 'photo') {
        childrenPreview.push(child)
      }
    })

    const totalChildren = fileList.length + childrenPreview.length

    if (totalChildren > uploadLimit) {
      alert(`Limite máximo de ${uploadLimit} fotos`)
      PhotosUpload.input.files = PhotosUpload.getAllFiles()
      event.preventDefault()
      return true
    }

    return false
  },

  getDataTransfer() {
    const forFirefox = new ClipboardEvent('').clipboardData
    const forChrome = new DataTransfer()

    const dataTransfer = forFirefox || forChrome

    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file))

    return dataTransfer.files
  },

  getContainerPhoto(image) {
    const container = document.createElement('div')
    container.classList.add('photo')
    container.onclick = PhotosUpload.removePhoto
    container.appendChild(image)

    container.appendChild(PhotosUpload.getRemoveButton())

    return container
  },

  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },

  removePhoto(event) {
    const photoDiv = event.target.parentNode
    const index = PhotosUpload.previewChildren.indexOf(photoDiv)

    PhotosUpload.previewChildren.splice(index, 1)
    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getDataTransfer()

    photoDiv.remove()
  },

  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector('[data-remove="file"]')

      if (removedFiles) removedFiles.value += `${photoDiv.id},`
    }
    photoDiv.remove()
  },
}

const ImageGallery = {
  container_full_img: document.querySelector('[data-gallery="full-img"] > img'),
  previews: document.querySelectorAll('[data-gallery-preview] img'),
  setImage(event) {
    const { target } = event

    ImageGallery.previews.forEach((preview) => {
      preview.classList.remove('active')
    })

    target.classList.add('active')

    ImageGallery.container_full_img.src = target.src
  },
}

const doc = window.document

const Validate = {
  userEmail: doc.querySelector('[data-user="email"]'),
  username: doc.querySelector('[data-user="name"]'),
  password: doc.querySelector('[data-password]'),
  requiredFields: doc.querySelectorAll('[data-required]'),
  newPassword: doc.querySelector('[data-password="new"]'),
  newPasswordConfirm: doc.querySelector('[data-password="confirm"]'),

  apply(event) {
    const {
      userEmail,
      username,
      password,
      requiredFields,
      newPassword,
      newPasswordConfirm,
    } = Validate

    const { checkEmail, checkLength, checkRequired, passwordsMatch } = Validate

    if (userEmail) checkEmail(userEmail, event)

    if (username) checkLength(username, 3, 25, event)

    if (password) checkLength(password, 6, 25, event)

    if (requiredFields) checkRequired(requiredFields, event)

    if (newPassword) passwordsMatch(newPassword, newPasswordConfirm, event)
  },

  // show input error message
  showError(input, message) {
    const formControl = input.parentElement
    formControl.className = 'content error'
    const small = formControl.querySelector('small')
    small.innerText = message
  },

  showSuccess(input) {
    const formControl = input.parentElement
    formControl.className = 'content success'
  },

  // Check emais is valid
  checkEmail(input, event) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const { showSuccess, showError } = Validate

    if (!re.test(String(input.value).trim())) {
      event.preventDefault()
      return showError(input, 'Email não pode ser em branco ou é inválido*')
    }
    return showSuccess(input)
  },

  // Check required fields
  checkRequired(values, event) {
    const { showError, showSuccess } = Validate

    values.forEach((input) => {
      if (input.value.trim() === '') {
        event.preventDefault()
        return showError(input, 'Este campo é obrigatório*')
      }
      return showSuccess(input)
    })
  },

  passwordsMatch(password, confirm_password, event) {
    const { showError } = Validate

    if (password.value !== confirm_password.value) {
      event.preventDefault()

      return showError(
        confirm_password,
        'Senha e confirmação de senha estão incorretas*'
      )
    }

    return event
  },

  checkLength(input, min, max, event) {
    const { showSuccess, showError } = Validate

    if (input.value.length < min) {
      event.preventDefault()
      return showError(input, `Deve ter no mínimo ${min} caracteres*`)
    }
    if (input.value.length > max) {
      event.preventDefault()
      return showError(input, `Deve ter no máximo ${max} caracteres*`)
    }

    return showSuccess(input)
  },
}

const Alert = {
  button: '',
  remove(event) {
    Alert.button = event.target
    Alert.button.parentElement.remove()
  },
}

const ConfirmDelete = {
  confirm: false,
  handleDelete(event) {
    let { confirm } = ConfirmDelete
    confirm = window.confirm('Tem certeza que deseja deletar?')

    if (!confirm) event.preventDefault()
  },
}

activePaginate()

this.onload = Menu.activeLink()
