
async function init() {
  const searchInput = document.getElementById("searchInput")
  try {
    const data = await loadData()
    console.log(data)
    searchInput.addEventListener("change", filterCards)
  } catch (error) {
    console.log(error)
  }


}
const arr = []
const dialogId = document.getElementById("dialogRadios")

closeButton.addEventListener("click", function () {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index] + 1;
    const radio = document.getElementById(element)
    if (radio.checked === true) {
      const input = document.getElementById(arr[index])
      input.checked = false
      arr.splice(index, 1)
    }

  }
  console.log(arr)
  localStorage.setItem("arrayOfCoins", JSON.stringify(arr))
})

async function loadData() {
  const j = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`)
  const data = await j.json()
  drawData(data)
  return data
}

function drawData(data) {
  const targetDraw = document.getElementById("content")
  data.forEach(currentCurensy => {
    const divButton = document.createElement('div');
    const button = createMoreInfoButton(currentCurensy)

    divButton.append(button)

    const divInput = document.createElement('div')
    divInput.className = "form-check form-switch"
    const input = document.createElement(`input`)
    input.className = "form-check-input "
    input.type = "checkbox"
    input.value = "unchecked"
    input.id = currentCurensy.id
    input.style = "background-color:rgb(232, 173, 64); border: 1px solid orange;"
    input.addEventListener("click", () => {
      if (input.value === "unchecked") {
        if (!arr.includes(input.id)) {
          arr.push(input.id);
          input.value = "checked"
        }
      } else {
        input.value = "unchecked"
        console.log(input.value)
        if (arr.includes(input.id)) {
          arr.splice(arr.indexOf(input.id), 1)
        }
      }
      console.log(arr)
      localStorage.setItem("arrayOfCoins", JSON.stringify(arr))
      if (arr.length > 5) {
        arr.forEach(current => {
          dialogId.innerHTML += ` <div class="form-check" style="display:flex">
                <input class="form-check-input" type="radio" id="${current + 1}" value=${current}" name="radioDefault">
                <label class="form-check-label" for=${current}">
                    "${current}"
                </label>
            </div>`
        })
        openDialog()
        document.getElementById("closeButton").addEventListener("click", function () {
          dialogId.innerHTML = ""
          closeDialog()
        })
      }

    })

    divInput.append(input)

    const divHeaders = document.createElement('div');

    const h4 = document.createElement(`h4`)
    h4.textContent = currentCurensy.name

    const h6 = document.createElement(`h6`)
    h6.textContent = currentCurensy.symbol
    divHeaders.append(h4, h6)

    const image = document.createElement(`img`)
    image.src = currentCurensy.image
    image.className = "img"

    const content = document.createElement('div');
    content.append(image, divHeaders, divInput)
    content.style.display = "flex"
    content.style.flexDirection = "row"
    content.style.justifyContent = "space-around"

    const container = document.createElement('div')
    container.className = "card-width container"
    container.style.border = "2px solid orange"
    container.style.backgroundColor = "white"
    container.style.display = "flex"
    container.style.flexDirection = "column"
    container.style.justifyContent = "space-around"

    container.append(content, divButton)
    targetDraw.appendChild(container)
  })


}

function addToList(id) {
  arr.push(id)
  console.log(arr)
  if (arr.length > 5) {
    const divDialog = document.createElement(`dialog`)
    divDialog.className = "modal-dialog modal-dialog-centered"
    document.body.append(divDialog)
  }
}

async function moreInfo(id) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
    const data = await response.json();

    const collapseBody = document.querySelector(`#collapse-${id} .card-body`)
    collapseBody.innerHTML = `<p><strong>USD:</strong> $${data.market_data.current_price.usd}</p>
      <p><strong>ILS:</strong> ₪${data.market_data.current_price.ils}</p>
      <p><strong>EUR:</strong> €${data.market_data.current_price.eur}</p>`
  } catch (eror) {
    console.log(eror)
  }
}

function createMoreInfoButton(coin) {
  const wrapper = document.createElement("div")

  const btn = document.createElement("button")
  btn.className = "btn btn-outline-warning mt-2"
  btn.textContent = "More Info"
  btn.setAttribute("data-bs-toggle", "collapse")
  btn.setAttribute("data-bs-target", `#collapse-${coin.id}`)

  btn.addEventListener("click", () => moreInfo(coin.id))

  const collapse = document.createElement("div")
  collapse.className = "collapse mt-2"
  collapse.id = `collapse-${coin.id}`

  const card = document.createElement("div")
  card.className = "card card-body"
  card.innerHTML = `<p>loading...</p>`
  collapse.appendChild(card)

  wrapper.append(btn, collapse)
  return wrapper;
}

function filterCards() {
  const query = document.getElementById('searchInput').value.toLowerCase()
  const cards = document.querySelectorAll('.card-width')

  cards.forEach(card => {
    const titleElement = card.querySelector('h4')
    if (!titleElement) return;

    const title = titleElement.innerText.toLowerCase()
    if (title.includes(query)) {
      card.style.display = 'flex'
    } else {
      card.style.display = 'none'
    }
  });
}

function openDialog() {
  document.getElementById('dialogBox').style.display = 'block'
}

function closeDialog() {
  document.getElementById('dialogBox').style.display = 'none'
}

init()

