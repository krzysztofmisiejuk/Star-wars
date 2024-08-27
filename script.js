import { rowData } from './data.js'

const body = document.querySelector('body')
const keys = Object.keys(rowData)
const values = Object.values(rowData)
const { tableContainer, inputs, paginationContainer } = createContainers()
displayNavbar()
const buttonContainer = addButtonContainer()
displayMainButtons()
const logo = displayLogo()
showActiveButton()
setColorTheme()
turnOnvoice()

function createContainers() {
  const tableContainer = document.createElement('table')
  const inputs = document.createElement('div')
  const paginationContainer = document.createElement('div')
  return { tableContainer, inputs, paginationContainer }
}

function displayNavbar() {
  const navbar = document.createElement('div')
  navbar.classList.add('navbar')
  navbar.innerHTML = `
    <div class="navbar-wrapper wrapper">
        <p>Write Yoda or Vader and hear the voice!</p>
        <div class="navbar-button-container">
            <button class="colorfull-mode">color fulltheme</button>
            <button class="dark-mode">dark theme</button>
        </div>
    </div>
`
  body.appendChild(navbar)
  return navbar
}

function addButtonContainer() {
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('button-container', 'wrapper')
  body.appendChild(buttonContainer)
  return buttonContainer
}

function displayLogo() {
  const logo = document.createElement('div')
  logo.classList.add('logo')
  body.appendChild(logo)
  return logo
}

function removeLogo() {
  logo.remove()
}

function displayMainButtons() {
  keys.forEach((item, index) => {
    generateMainButton(item, index, buttonContainer)
  })
}
function generateMainButton(obj, index, parent) {
  const button = document.createElement('button')
  button.id = `${index}`
  button.textContent = obj
  button.classList.add('main-button')
  parent.appendChild(button)

  button.addEventListener('click', function (event) {
    removeLogo(logo)
    updateInputsForSearching(event, body, values[index].length)
    assingTableTitles(event, index)
    addPagination(body)
    updateTableFields(event)
  })
}

function updateTableFields(event) {
  const table = document.querySelector('table')
  const tbody = document.createElement('tbody')
  const searchByTextInput = document.querySelector('#searchByText')
  const searchByIndexInput = document.getElementById('searchByIndex')
  const select = document.querySelector('select')

  table.append(tbody)
  keys.forEach((key, index) => {
    if (event.target.textContent === keys[index]) {
      values[index].forEach(
        (
          {
            name,
            model,
            manufacturer,
            created,
            classification,
            designation,
            rotation_period,
            climate,
            hair_color,
            skin_color,
            title,
            episode_id,
            director,
          },
          index
        ) => {
          //SPECIES
          if (!model && !manufacturer) {
            model = classification
            manufacturer = designation
          }
          //PLANETS
          if (!classification && !model) {
            model = rotation_period
            manufacturer = climate
          }
          //PEOPLE
          if (!model && !climate) {
            model = hair_color
            manufacturer = skin_color
          }
          //FILMS
          if (!model && !skin_color) {
            name = title
            model = episode_id
            manufacturer = director
          }

          const date = new Date(created)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          const day = date.getDate()

          const newRow = document.createElement('tr')
          tbody.id = event.target.id

          newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${name}</td>
            <td>${model}</td>
            <td>${manufacturer}</td>
            <td>${day}-${month}-${year}</td>
            <td>
              <div class="actions">
              <button class="actions-btn-delete" id="delete"></button>
              <button class="actions-btn-add" id="add"></button>
              <input type="checkbox">
              </div>
            </td>
          `
          newRow.id = index
          newRow.classList.add('row')
          tbody.appendChild(newRow)
        }
      )
      selectNumbersOfRows(select)
    }
    deleteSingleRow()
    handleRemoveAllButton()
    updateNumbersOfRow()

    if (searchByTextInput) {
      searchByTextInput.addEventListener('keyup', function () {
        searchByText(select)
      })
    }
    searchByIndexInput.addEventListener('keyup', function () {
      searchByIndex(select)
    })
    select.addEventListener('change', function () {
      selectNumbersOfRows(select)
    })
  })
  const addBtns = document.querySelectorAll('#add')
  addBtns.forEach(btn =>
    btn.addEventListener('click', function (event) {
      showModal(event)
    })
  )
}

function selectNumbersOfRows(select) {
  const rows = Array.from(document.querySelectorAll('.row'))
  const option20 = document.querySelector('select option:last-child')
  if (rows.length < 10) {
    option20.style.display = 'none'
  }
  rows.forEach((row, index) => {
    row.style.display = 'none'
    if (select.value === '20') {
      if (index < 20) {
        row.style.display = 'table-row'
      }
    } else if (select.value === '10' || select.value === '') {
      if (index < 10) {
        row.style.display = 'table-row'
      }
    }
  })
  handlePagination(rows, select.value, select)
}

function showModal(event) {
  const modal = document.createElement('div')
  modal.innerHTML = `<button class="close-modal-btn">&times;</button>
  <table class="modal-table">
    <thead class="modal-thead">
        <td>Key</td>
        <td>Value</td>
    </thead>
  </table>`
  body.append(modal)

  modal.classList.add('modal')
  const modalTable = modal.querySelector('table')
  const tbody = document.createElement('tbody')
  modalTable.appendChild(tbody)
  updateModalContent(tableContainer, tbody)
  closeModal()
}

function updateModalContent(tableContainer, tbody) {
  const mainTableName = tableContainer.querySelector('tbody')
  const addBtns = document.querySelectorAll('#add')
  let valuesFromRow = Object.values(values[mainTableName.id])
  addBtns.forEach((btn, index) => {
    if (event.target === btn) {
      Object.entries(valuesFromRow[index]).forEach(entry => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td>${entry[0]}</td>
        <td>${entry[1]}</td>
        `
        tbody.append(tr)
      })
    }
  })
}

function closeModal() {
  const modals = document.querySelectorAll('.modal')
  const closeBtns = document.querySelectorAll('.close-modal-btn')
  closeBtns.forEach(button =>
    button.addEventListener('click', function () {
      modals.forEach(modal => {
        body.removeChild(modal)
      })
    })
  )
}

function showRemoveAllButton(parent) {
  const button = document.createElement('button')
  button.classList.add('remove-all')
  button.textContent = 'Remove all'
  parent.appendChild(button)
  button.addEventListener('click', () => {
    button.remove()
    removeCheckedRows()
  })
}

function handleRemoveAllButton() {
  const checkboxes = document.querySelectorAll('input[type=checkbox]')
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const removeAllButton = document.querySelector('.remove-all')
      if (checkbox.checked && !removeAllButton) {
        showRemoveAllButton(tableContainer)
      } else if (!checkbox.checked && removeAllButton) {
        const anyChecked = Array.from(checkboxes).some(item => item.checked)
        if (!anyChecked) {
          removeAllButton.remove()
        }
      }
    })
  })
}

function updateTableContainer(parent, index, value1, value2, value3) {
  tableContainer.innerHTML = `
        <table class="wrapper">
          <thead>
            <td>ID</td>
            <td>${value1}</td>
            <td>${value2}</td>
            <td>${value3}</td>
            <td>Created</td>
            <td>Actions</td>
          </thead>
        </table>
   `
  parent.appendChild(tableContainer)
  updateNumbersOfRow()
}

function assingTableTitles(event, index) {
  let title1 = 'name'
  let title2 = 'model'
  let title3 = 'manufacturer'

  if (event.target.textContent === keys[2]) {
    title2 = 'classification'
    title3 = 'designation'
  } else if (event.target.textContent === keys[3]) {
    title2 = 'rotation period'
    title3 = 'climate'
  } else if (event.target.textContent === keys[4]) {
    title2 = 'hair color'
    title3 = 'skin color'
  } else if (event.target.textContent === keys[5]) {
    title1 = 'title'
    title2 = 'episode id'
    title3 = 'director'
  }
  //ADD TABLE TO DOM
  updateTableContainer(body, index, title1, title2, title3)
}

function updateNumbersOfRow() {
  const rows = document.querySelectorAll('.row')
  const searchByIndexInput = document.getElementById('searchByIndex')
  searchByIndexInput.placeholder = `1 of ${rows.length}`
  searchByIndexInput.setAttribute('min', '1')
  searchByIndexInput.setAttribute('max', rows.length)
}

function updateInputsForSearching(event, parent, amountOfRows) {
  let kindOfText = 'name'
  if (event.target.textContent.toLowerCase() === 'films') {
    kindOfText = 'title'
  }
  inputs.innerHTML = `
      <div class="serarch-container-item">
          <label for="searchByText">Search by text</label>
          <input type="text" id="searchByText" placeholder="Search by ${kindOfText}">
          </div>
      <div class="serarch-container-item">
           <label for="searchByIndex">Search by Index</label>
           <input type="number" id="searchByIndex" placeholder="1 of ${amountOfRows}">
      </div>
  `
  inputs.classList.add('search-container')
  parent.appendChild(inputs)
}

function searchByText(select) {
  const searchByTextInput = document.querySelector('#searchByText')
  const searchByIndexInput = document.getElementById('searchByIndex')
  const rows = Array.from(document.querySelectorAll('.row'))
  const visibleRows = rows.filter(row => row.style.display === 'table-row')
  let placeholderText

  if (searchByTextInput.value.length === 0) {
    placeholderText = rows.length
  } else {
    placeholderText = visibleRows.length
  }
  searchByIndexInput.placeholder = `1 of ${placeholderText}`
  rows.forEach(row => {
    const nameOrTitle = row
      .querySelector('td:nth-child(2)')
      .textContent.toLowerCase()
    if (nameOrTitle.includes(searchByTextInput.value.toLowerCase())) {
      row.style.display = 'table-row'
    } else {
      row.style.display = 'none'
    }

    if (searchByTextInput.value === '') {
      selectNumbersOfRows(select)
    }
  })
  updatePaginationAfterSearching()
}

function searchByIndex(select) {
  const searchByIndexInput = document.getElementById('searchByIndex')
  const rows = Array.from(document.querySelectorAll('.row'))
  rows.forEach(row => {
    let rowsNumber = Number(row.id) + 1
    if (
      searchByIndexInput.value === rowsNumber.toString() ||
      searchByIndexInput.value === ''
    ) {
      row.style.display = 'table-row'
    } else {
      row.style.display = 'none'
    }
  })
  if (searchByIndexInput.value === '') {
    selectNumbersOfRows(select)
  }
  updatePaginationAfterSearching()
}

function addPagination(parent) {
  paginationContainer.innerHTML = `
        <button class="arrow-btn arrow-left"></button>
        <div class="pages"><input type="number" id="pageInput" value ="1"><span class="current-page"></span></div>
        <button class="arrow-btn arrow-right"></button>
        <select name="pages" id="pages">
            <option value="10">10</option>
            <option value="20">20</option>
        </select>
  `
  paginationContainer.classList.add('pagination-container')
  parent.appendChild(paginationContainer)
}

function handlePagination(rows, selectedValue = 10, select) {
  const prev = document.querySelector('.arrow-left')
  const next = document.querySelector('.arrow-right')
  const currentPage = document.querySelector('.current-page')
  const pagesInput = document.querySelector('#pageInput')
  let numberOfPage = Math.ceil(rows.length / selectedValue)
  let number = 1

  pagesInput.setAttribute('min', '1')
  pagesInput.setAttribute('max', numberOfPage)
  currentPage.textContent = ` of ${numberOfPage}`

  function showCurrentPages(number = 1) {
    const rowsPerPage = Number(select.value)
    const startId = (number - 1) * rowsPerPage
    const endId = number * rowsPerPage
    rows.forEach(row => {
      const rowId = Number(row.id)
      if (rowId >= startId && rowId < endId) {
        row.style.display = 'table-row'
      } else {
        row.style.display = 'none'
      }
    })
  }

  function updatePrevButton() {
    if (number <= 1 || numberOfPage === 1) {
      prev.disabled = true
    } else {
      prev.disabled = false
    }
  }

  function updateNextButton() {
    if (number >= numberOfPage || numberOfPage === 1) {
      next.disabled = true
    } else {
      next.disabled = false
    }
  }

  prev.addEventListener('click', function () {
    number--
    updatePrevButton()
    updateNextButton()
    showCurrentPages(number)
    pagesInput.value = number
  })
  next.addEventListener('click', function () {
    number++
    updatePrevButton()
    updateNextButton()
    showCurrentPages(number)
    pagesInput.value = number
  })
  select.addEventListener('change', function () {
    pagesInput.value = 1
  })

  pagesInput.addEventListener('input', function () {
    number = Number(pagesInput.value) || 1
    if (number > numberOfPage) number = numberOfPage
    if (number < 1) number = 1
    updatePrevButton()
    updateNextButton()
    showCurrentPages(number)
  })
  updatePrevButton()
  updateNextButton()
  showCurrentPages()
  updatePaginationInputAfterDeletion(pagesInput, numberOfPage)
}

function updatePaginationAfterDeletion() {
  const select = document.querySelector('select')
  const rows = Array.from(document.querySelectorAll('.row'))
  handlePagination(rows, select.value, select)
}

function updatePaginationInputAfterDeletion(pagesInput, numberOfPage) {
  if (parseInt(pagesInput.value) > numberOfPage) pagesInput.value = numberOfPage
}

function updatePaginationAfterSearching() {
  const pagesInput = document.querySelector('#pageInput')
  pagesInput.value = 1
}

function removeCheckedRows() {
  const checkboxes = document.querySelectorAll('input[type=checkbox]')
  const rows = document.querySelectorAll('.row')
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      rows[index].remove()
      updateNumbersOfRow()
    }
  })
  updatePaginationAfterDeletion()
}

function deleteSingleRow() {
  const rows = document.querySelectorAll('.row')
  const deleteBtns = document.querySelectorAll('#delete')
  deleteBtns.forEach((btn, index) => {
    btn.addEventListener('click', function () {
      rows.forEach(row => {
        if (index.toString() === row.id) {
          row.remove()
          updateNumbersOfRow()
          updatePaginationAfterDeletion()
        }
      })
    })
  })
}

function showActiveButton() {
  const mainButtons = document.querySelectorAll('.main-button')
  mainButtons.forEach(button => {
    button.addEventListener('click', function () {
      mainButtons.forEach(btn => btn.classList.remove('active'))
      button.classList.add('active')
    })
  })
}

function setColorTheme() {
  const darkModeBtn = document.querySelector('.dark-mode')
  const colorfullModeBtn = document.querySelector('.colorfull-mode')
  darkModeBtn.addEventListener('click', setDarkTheme)
  colorfullModeBtn.addEventListener('click', setColorfullTheme)
}
function setDarkTheme() {
  body.classList.add("dark-theme")
}
function setColorfullTheme() {
  body.classList.remove("dark-theme")
}

function turnOnvoice() {
  let lettersKeys = []
  document.addEventListener('keyup', function (event) {
    defineVoice(event, lettersKeys)
  })
}

function defineVoice(event, arr) {
  arr.push(event.key)
  let word = arr.join('').toLowerCase()
  if (word.includes('vader')) {
    addAudio('vader', arr)
  } else if (word.includes('yoda')) {
    addAudio('yoda', arr)
  }
}

function addAudio(word, arr) {
  const isExistAudio = document.querySelector('audio')
  if (!isExistAudio) {
    const voice = document.createElement('audio')
    document.body.append(voice)
    voice.setAttribute('src', `./audio/${word}.mp3`)
    voice.play()
    voice.addEventListener('ended', () => voice.remove())
    arr.length = 0
  } else {
    arr.length = 0
  }
}
